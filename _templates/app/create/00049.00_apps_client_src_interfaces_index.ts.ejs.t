---
to: <%= h.client(`${ROOT}/apps/${CLIENT_NAME}/src/interfaces/index.ts`) %>
unless_exists: true
---
export * from './i-error';
