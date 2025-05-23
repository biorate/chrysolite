---
to: <%= h.server(`${ROOT}/apps/${SERVER_NAME}/src/app/common/application/errors/index.ts`) %>
unless_exists: true
---
<% if (!CUT_EXAMPLES) { -%>
export * from './user.errors';
<% } -%>
