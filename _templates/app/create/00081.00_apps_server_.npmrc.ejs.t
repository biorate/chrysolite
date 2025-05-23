---
to: <%= h.server(`${ROOT}/apps/${SERVER_NAME}/.npmrc`) %>
unless_exists: true
---
engine-strict=true
