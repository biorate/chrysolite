---
to: <%= h.client(`${ROOT}/apps/${CLIENT_NAME}/tests/common/spec.ts`) %>
unless_exists: true
---
export abstract class Spec {}
