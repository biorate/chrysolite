---
to: <%= h.server(`${ROOT}/apps/${SERVER_NAME}/package.json`) %>
unless_exists: true
---
{
  "name": "<%= SERVER_NAME %>",
  "version": "0.0.0",
  "description": "<%= APP_DESCRIPTION %> (server application)",
  "main": "dist",
  "scripts": {
    "start": "cross-env LOG_ENABLED=1 LOG_LEVEL=info,error,warn NODE_ENV=production node ./dist/index.js",
    "build": "cross-env NODE_ENV=production npx tsc -p ./tsconfig.build.json --outDir ./dist",
    "start:debug": "cross-env npx nodemon --exec ts-node index.ts",
    "test": "npx nyc -- npx mocha",
    "migrations": "node -r @biorate/migrations",
    "lint:fix": "npx eslint --fix ./src",
    "prettier:fix": "npx prettier --write ./src",
    "allure:report": "npx allure serve allure-results --clean -o allure-report",
    "hooks:pre-commit": "pnpm run prettier:fix && pnpm run lint:fix"
  },
  "keywords": [],
  "author": "llevkin",
  "license": "UNLICENSED",
  "dependencies": {
    "@biorate/axios-prometheus": "1.120.0",
    "@biorate/config-loader": "1.120.0",
    "@biorate/config-loader-env": "1.120.0",
    "@biorate/config-loader-fs": "1.120.0",
    "@biorate/config-loader-vault": "1.120.0",
    "@biorate/nestjs-tools": "1.125.2",
    "@biorate/prometheus": "1.120.0",
    "@biorate/vault": "1.120.0",
    "@nestjs/common": "10.4.15",
    "@nestjs/core": "10.4.15",
    "@nestjs/event-emitter": "^3.0.1",
    "@nestjs/platform-express": "10.4.15",
    <%- ADD_WEB_SOCKET ? '"@nestjs/platform-ws": "10.4.15",' : '' -%>
    "@nestjs/schedule": "^6.0.0",
    <%- CLIENT ? '"@nestjs/serve-static": "4.0.2",' : '' -%>
    "@nestjs/swagger": "8.1.0",
    <%- ADD_WEB_SOCKET ? '"@nestjs/websockets": "10.4.15",' : '' -%>
    "class-transformer": "0.5.1",
    "class-validator": "0.14.0",
    "cookie-parser": "1.4.5",
    "express": "4.18.2",
    "helmet": "4.6.0",
    "http-proxy-middleware": "2.0.6",
    "serve-favicon": "2.5.0",
    "source-map-support": "0.5.21",
    "swagger-ui-express": "4.6.2"
    <%- ADD_WEB_SOCKET ? ',"ws": "8.14.2"' : '' -%>
  },
  "devDependencies": {
    "@biorate/migrations": "1.120.0",
    "@biorate/mocha": "1.102.1",
    "@biorate/mocha-spec": "1.117.0",
    "@istanbuljs/nyc-config-typescript": "1.0.2",
    "@types/cookie-parser": "1.4.3",
    "@types/express": "4.17.17",
    "@types/mocha": "9.1.1",
    <%- ADD_WEB_SOCKET ? '"@types/ws": "8.5.8",' : '' -%>
    "nodemon": "3.1.3",
    "mocha": "10.2.0",
    "mocha-chai-jest-snapshot": "1.1.4",
    "mocha-multi-reporters": "1.5.1",
    "testcontainers": "10.9.0"
  }
}
