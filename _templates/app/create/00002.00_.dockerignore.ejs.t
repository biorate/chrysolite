---
to: <%= h.root(`${ROOT}/.dockerignore`) %>
unless_exists: true
---
.git
coverage
node_modules
<%= CLIENT ? `apps/${CLIENT_NAME}/node_modules` : '' %>
<%= SERVER ? `apps/${SERVER_NAME}/node_modules` : '' %>
.dockerignore
Dockerfile
docker-compose.yml
