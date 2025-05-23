---
to: <%= h.client(`${ROOT}/apps/${CLIENT_NAME}/src/view/containers/app/index.less`) %>
unless_exists: true
---
.app {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
}
