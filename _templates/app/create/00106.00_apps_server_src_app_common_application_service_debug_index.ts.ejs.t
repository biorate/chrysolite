---
to: <%= h.server(`${ROOT}/apps/${SERVER_NAME}/src/app/common/application/service/debug/index.ts`) %>
unless_exists: true
---
export * from './debug.hello-world.use-case';
