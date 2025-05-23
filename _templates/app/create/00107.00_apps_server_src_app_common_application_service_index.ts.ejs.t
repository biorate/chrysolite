---
to: <%= h.server(`${ROOT}/apps/${SERVER_NAME}/src/app/common/application/service/index.ts`) %>
unless_exists: true
---
<% if (!CUT_EXAMPLES) { -%>
export * from './user';
<% } -%>
<%- CLIENT ? "export * from './client';" : '' -%>
export * from './info';
export * from './debug';
