---
to: <%= h.server(`${ROOT}/apps/${SERVER_NAME}/config.debug.json`) %>
unless_exists: true
---
{}
