---
to: <%= h.server(`${ROOT}/apps/${SERVER_NAME}/.mocharc.json`) %>
unless_exists: true
---
{
  "require": "source-map-support/register,ts-node/register",
  "spec": "tests/**/*.spec.ts",
  "reporter": "mocha-multi-reporters",
  "reporter-option": "configFile=.reporters.json",
  "exit": true,
  "parallel": false
}
