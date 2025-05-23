---
to: <%= h.server(`${ROOT}/apps/${SERVER_NAME}/src/app/common/infrastructure/adapters/index.ts`) %>
unless_exists: true
---
export * from './user.repository.adapter';
export * from './client.repository.adapter';
export * from './debug.http.adapter';
export * from './info.repository.adapter';
