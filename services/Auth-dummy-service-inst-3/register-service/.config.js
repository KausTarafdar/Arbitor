export const gatewayUrl = process.env.GATEWAY_URL || "http://localhost:5000/register"

export const apiData = {
  "api_name" : "proto_login",
  "base_url" : process.env.SERVICE_BASE_URL || "http://localhost",
  "port"     : "3004",
}

export const routes = [
  {
    "api_key"     : "/health",
    "endpoint"    : "/health",
    "access_type" : "public",
  },
  {
    "api_key"     : "/login",
    "endpoint"    : "/login",
    "access_type" : "public",
  },
  {
    "api_key"     : "/logout",
    "endpoint"    : "/logout",
    "access_type" : "public",
  }
]