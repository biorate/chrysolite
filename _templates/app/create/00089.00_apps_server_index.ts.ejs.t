---
to: <%= h.server(`${ROOT}/apps/${SERVER_NAME}/index.ts`) %>
unless_exists: true
---
import './src';
