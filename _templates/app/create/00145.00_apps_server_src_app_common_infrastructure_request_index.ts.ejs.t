---
to: <%= h.server(`${ROOT}/apps/${SERVER_NAME}/src/app/common/infrastructure/request/index.ts`) %>
unless_exists: true
---
export * from './info';
