---
to: <%= h.client(`${ROOT}/apps/${CLIENT_NAME}/tests/scenarios/index.ts`) %>
unless_exists: true
---
export * from './scenario1';
export * from './scenario2';
