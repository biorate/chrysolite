---
to: <%= h.server(`${ROOT}/apps/${SERVER_NAME}/config.json`) %>
unless_exists: true
---
{}
