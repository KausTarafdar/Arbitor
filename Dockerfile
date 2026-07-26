FROM node:20-alpine
WORKDIR /app

# Root deps are shared (via Node's directory-walking module resolution)
# by the dummy services and the register-service client library.
COPY package*.json ./
RUN npm install

# The gateway has its own deps (cors, node-pg-migrate, ...) that live
# in arbitor/node_modules and take precedence over the root ones.
COPY arbitor/package*.json ./arbitor/
RUN cd arbitor && npm install

COPY . .

CMD ["node", "arbitor/src/gateway.js"]
