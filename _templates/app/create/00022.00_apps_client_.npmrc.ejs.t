---
to: <%= h.client(`${ROOT}/apps/${CLIENT_NAME}/.npmrc`) %>
unless_exists: true
---
engine-strict=true
