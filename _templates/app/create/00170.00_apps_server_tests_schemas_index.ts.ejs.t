---
to: <%= h.server(`${ROOT}/apps/${SERVER_NAME}/tests/schemas/index.ts`) %>
unless_exists: true
---
export * from 'class-validator';
<% if (!CUT_EXAMPLES) { %>
export * from './test';
export * from './scenarios';
<% } %>
