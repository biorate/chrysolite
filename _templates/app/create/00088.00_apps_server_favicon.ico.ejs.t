---
sh: <%= h.server(`npx fse copy ${templates}/app/create/bin/favicon.ico ${ROOT}/apps/${SERVER_NAME}/favicon.ico`) %>
unless_exists: true
---
