FROM node:16.2-alpine as build
ARG BUILD_SCOPE

WORKDIR /app

COPY package*.json lerna.json ./
RUN npm ci

COPY . .
RUN npm run bootstrap
RUN npm run build -- --scope ${BUILD_SCOPE} --include-dependencies

FROM node:16.2-alpine
RUN apk add --no-cache tini
ARG BUILD_SCOPE
ENV SERVICE_NAME=${BUILD_SCOPE}

WORKDIR /app
COPY docker-entrypoint.sh /usr/local/bin/

COPY package*.json lerna.json ./
RUN npm ci --production

COPY api-clients/package*.json ./api-clients/
COPY collections-api/package*.json ./collections-api/
COPY hn-sync/package*.json ./hn-sync/
COPY models/package*.json ./models/
COPY repositories/package*.json ./repositories/
COPY --from=build /app/build/ ./
RUN npx lerna bootstrap --ci --scope ${BUILD_SCOPE} --include-dependencies -- --production

USER node
ENTRYPOINT ["/sbin/tini", "--", "docker-entrypoint.sh"]
