---
to: <%= h.client(`${ROOT}/apps/${CLIENT_NAME}/src/api/index.ts`) %>
unless_exists: true
---
export * from './config';
