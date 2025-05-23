---
to: <%= h.server(CUT_EXAMPLES || `${ROOT}/apps/${SERVER_NAME}/tests/__unit-args__/Test.mutate.mutate2.json`) %>
unless_exists: true
---
[{ "inc": 1 }]
