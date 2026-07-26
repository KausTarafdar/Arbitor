FROM node:20-alpine
WORKDIR /app

# npm workspaces: one install at the root resolves and hoists deps for the
# gateway (arbitor/) and every dummy service (services/*) in one shot.
COPY package.json package-lock.json ./
COPY arbitor/package.json ./arbitor/
COPY services/package.json ./services/
COPY services/Auth-dummy-service/package.json ./services/Auth-dummy-service/
COPY services/Message-dummy-service/package.json ./services/Message-dummy-service/
COPY services/User-dummy-service/package.json ./services/User-dummy-service/
RUN npm install

COPY . .

CMD ["node", "arbitor/src/gateway.js"]
