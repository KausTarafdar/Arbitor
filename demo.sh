#!/usr/bin/env bash
# Walks through Arbitor end to end against the Docker Compose stack:
# registration, hash-based load balancing across 3 Auth instances, and
# failover + auto-deregistration when an instance is killed.
set -uo pipefail

if docker compose version >/dev/null 2>&1; then
  COMPOSE="docker compose"
elif command -v docker-compose >/dev/null 2>&1; then
  COMPOSE="docker-compose"
else
  echo "Neither 'docker compose' nor 'docker-compose' is available." >&2
  exit 1
fi

GATEWAY_PORT=5050
# Compose lowercases the directory name to derive the project/container prefix
PROJECT_PREFIX="$(basename "$(pwd)" | tr '[:upper:]' '[:lower:]')"

bold() { printf '\033[1m%s\033[0m\n' "$1"; }
step()  { echo; bold "==> $1"; }

log_count() {
  # number of lines currently in a container's logs
  docker logs "$1" 2>&1 | wc -l | tr -d ' '
}

call_login_from() {
  # exec into a running container and hit the gateway from its own IP,
  # so each caller lands at a different point on the hash ring
  docker exec "$1" node -e "
    fetch('http://gateway:5000/api/proto_login/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: '$1' })
    }).then(r => r.json()).then(j => console.log(JSON.stringify(j)))
      .catch(e => console.log('ERR ' + e.message))
  " 2>/dev/null
}

step "Starting Postgres, running migrations, starting the gateway + 5 dummy services"
$COMPOSE up -d --build

step "Waiting for the gateway to become healthy"
for i in $(seq 1 30); do
  status=$(docker inspect --format '{{.State.Health.Status}}' "${PROJECT_PREFIX}-gateway-1" 2>/dev/null || echo "starting")
  [ "$status" = "healthy" ] && break
  sleep 1
done
if [ "$status" != "healthy" ]; then
  echo "Gateway did not become healthy in time. Check: docker compose logs gateway" >&2
  exit 1
fi
echo "Gateway is up at http://localhost:${GATEWAY_PORT}"

# Dummy services register themselves on startup once the gateway is
# reachable; give the slowest of the 5 a moment to finish.
sleep 2

step "Services registered so far (from Postgres)"
docker exec "${PROJECT_PREFIX}-postgres-1" psql -U arbitor -d arbitor -c \
  "SELECT api_name, api_key, base_url, port FROM services ORDER BY base_url;"

step "Load-balancing demo: calling /api/proto_login/login from 5 different containers"
echo "(each container has a distinct IP on the Compose network, so the gateway's"
echo " SHA1-hash-ring load balancer routes each caller to a different instance)"
CALLERS="auth-1 auth-2 auth-3 message user"
for name in $CALLERS; do
  eval "before_${name//-/_}=$(log_count "${PROJECT_PREFIX}-${name}-1")"
done
for name in $CALLERS; do
  res=$(call_login_from "${PROJECT_PREFIX}-${name}-1")
  echo "  from ${name}: ${res}"
done
echo
echo "Requests handled per Auth instance:"
target=""
for name in auth-1 auth-2 auth-3; do
  before_var="before_${name//-/_}"
  after=$(log_count "${PROJECT_PREFIX}-${name}-1")
  diff=$((after - ${!before_var}))
  echo "  ${name}: ${diff} request(s)"
  if [ "$diff" -gt 0 ] && [ -z "$target" ]; then
    target="$name"
  fi
done

if [ -z "$target" ]; then
  echo "No instance was hit directly this run; skipping failover demo." >&2
  exit 0
fi

step "Failover demo: killing ${target}"
docker stop "${PROJECT_PREFIX}-${target}-1" >/dev/null
echo "${target} is now stopped."

echo
echo "Replaying the same calls - traffic that used to land on ${target} should"
echo "now transparently fail over to a healthy instance instead of erroring:"
for name in $CALLERS; do
  [ "$name" = "$target" ] && continue
  res=$(call_login_from "${PROJECT_PREFIX}-${name}-1")
  echo "  from ${name}: ${res}"
done

step "Health checker: flagging + deregistering the dead instance"
sleep 1
echo "flagged_services right after the failed calls:"
docker exec "${PROJECT_PREFIX}-postgres-1" psql -U arbitor -d arbitor -c \
  "SELECT api_name, base_url, port FROM flagged_services;"

echo "Sending one more call so the janitor's periodic recheck runs..."
call_login_from "${PROJECT_PREFIX}-auth-2-1" >/dev/null 2>&1 || true
sleep 1

echo
echo "${target} should now be gone from the live registry:"
docker exec "${PROJECT_PREFIX}-postgres-1" psql -U arbitor -d arbitor -c \
  "SELECT api_name, base_url, port FROM services WHERE base_url = 'http://${target}';"

step "Queryable logs: every request and error above is in the gateway's log table"
echo "Most recent access logs:"
curl -s "http://localhost:${GATEWAY_PORT}/_logs?level=access&limit=5" | node -e "
  let data = '';
  process.stdin.on('data', c => data += c);
  process.stdin.on('end', () => {
    const { logs } = JSON.parse(data);
    for (const l of logs) console.log(\`  \${l.created_at}  \${l.method.padEnd(6)} \${l.path.padEnd(30)} \${l.status_code}  \${l.duration_ms}ms\`);
  });
"
echo
echo "Recent error logs:"
curl -s "http://localhost:${GATEWAY_PORT}/_logs?level=error&limit=5" | node -e "
  let data = '';
  process.stdin.on('data', c => data += c);
  process.stdin.on('end', () => {
    const { logs } = JSON.parse(data);
    for (const l of logs) console.log(\`  \${l.created_at}  \${l.method} \${l.path}  -  \${l.message}\`);
  });
"

step "Done"
echo "Stack is still running. Useful commands:"
echo "  ${COMPOSE} logs -f gateway              # watch the gateway"
echo "  curl http://localhost:${GATEWAY_PORT}/_logs?level=error  # query error logs"
echo "  ${COMPOSE} down                         # tear everything down"
