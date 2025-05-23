---
---
<%
  ROOT = locals['root'] ?? cwd;
  APP_NAME = locals['app-name'];
  APP_DESCRIPTION = locals['app-description'];
  SERVER = locals['server'];
  CLIENT = locals['client'];
  HYGEN = locals['hygen'];
  SERVER_NAME = APP_NAME + '-server';
  CLIENT_NAME = APP_NAME + '-client';
  SERVER_DIR = `${ROOT}/apps/${SERVER_NAME}`;
  CLIENT_DIR = `${ROOT}/apps/${CLIENT_NAME}`;
  CUT_EXAMPLES = locals['cut-examples'];
  ADD_WEB_SOCKET = locals['add-web-socket'];

  h.defined({
    APP_NAME,
    APP_DESCRIPTION,
  });
%>
