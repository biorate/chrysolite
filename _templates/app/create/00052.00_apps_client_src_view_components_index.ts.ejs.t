---
to: <%= h.client(`${ROOT}/apps/${CLIENT_NAME}/src/view/components/index.ts`) %>
unless_exists: true
---
export * from './spinner';
export * from './version';
export * from './slot';
export * from './hello';

