---
to: <%= h.server(CLIENT && `${ROOT}/apps/${SERVER_NAME}/src/app/common/application/service/client/index.ts`) %>
unless_exists: true
---
export * from './client.get-config.use-case';
