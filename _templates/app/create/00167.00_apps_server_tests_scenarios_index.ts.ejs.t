---
to: <%= h.server(CUT_EXAMPLES || `${ROOT}/apps/${SERVER_NAME}/tests/scenarios/index.ts`) %>
unless_exists: true
---
export * from './scenario1';
export * from './scenario2';
