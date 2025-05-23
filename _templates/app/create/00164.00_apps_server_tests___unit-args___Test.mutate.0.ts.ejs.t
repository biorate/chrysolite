---
to: <%= h.server(CUT_EXAMPLES || `${ROOT}/apps/${SERVER_NAME}/tests/__unit-args__/Test.mutate.0.ts`) %>
unless_exists: true
---
export default [{ inc: 1 }];
