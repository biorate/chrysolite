---
to: <%= h.client(`${ROOT}/apps/${CLIENT_NAME}/src/api/errors/index.ts`) %>
unless_exists: true
---
export * from './base-error';
export * from './unknown-error';
