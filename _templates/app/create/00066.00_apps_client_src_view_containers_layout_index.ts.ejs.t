---
to: <%= h.client(`${ROOT}/apps/${CLIENT_NAME}/src/view/containers/layout/index.ts`) %>
unless_exists: true
---
export * from './layout';



