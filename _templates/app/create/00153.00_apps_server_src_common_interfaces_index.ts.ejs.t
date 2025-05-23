---
to: <%= h.server(`${ROOT}/apps/${SERVER_NAME}/src/common/interfaces/index.ts`) %>
unless_exists: true
---
export * from './application';
