---
to: <%= h.server(`${ROOT}/apps/${SERVER_NAME}/.reporters.json`) %>
unless_exists: true
---
{
  "reporterEnabled": "allure-mocha,spec",
  "allureMochaReporterOptions": {
    "resultsDir": "./allure-results"
  }
}
