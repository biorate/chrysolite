---
to: <%= h.server(`${ROOT}/apps/${SERVER_NAME}/locales/translation/en.json`) %>
unless_exists: true
---
{
  "Привет мир": "Hello world"
}
