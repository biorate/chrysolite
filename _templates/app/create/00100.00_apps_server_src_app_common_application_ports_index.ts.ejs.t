---
to: <%= h.server(`${ROOT}/apps/${SERVER_NAME}/src/app/common/application/ports/index.ts`) %>
unless_exists: true
---
<%- CLIENT ? "export * from './client.driven.port';" : '' -%>
<% if (!CUT_EXAMPLES) { -%>
export * from './user.driven.port';
<% } -%>
export * from './info.driven.port';
export * from './debug.driven.port';
