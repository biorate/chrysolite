---
to: <%= h.client(`${ROOT}/apps/${CLIENT_NAME}/src/images.d.ts`) %>
unless_exists: true
---
declare module '*.svg' {
  const content: any;
  export default content;
}
