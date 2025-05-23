---
to: <%= h.server(`${ROOT}/apps/${SERVER_NAME}/.nycrc.json`) %>
unless_exists: true
---
{
  "extends": "@istanbuljs/nyc-config-typescript",
  "all": true,
  "check-coverage": true,
  "reporter": ["lcov", "text-summary"],
  "statements": 80,
  "branches": 60,
  "functions": 40,
  "lines": 88
}
