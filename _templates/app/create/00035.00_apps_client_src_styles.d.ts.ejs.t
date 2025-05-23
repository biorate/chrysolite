---
to: <%= h.client(`${ROOT}/apps/${CLIENT_NAME}/src/styles.d.ts`) %>
unless_exists: true
---
declare module '*.module.css';
declare module '*.module.less';
declare module '*.module.scss';
