---
to: <%= h.root(`${ROOT}/.prettierrc`) %>
unless_exists: true
---
{
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 90,
  "endOfLine": "auto"
}
