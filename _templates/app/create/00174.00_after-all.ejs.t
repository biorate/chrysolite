---
sh: "
  npx prettier --write <%= ROOT %>
  <%- HYGEN ? '' : '&& npx fse remove --quiet doc' %>
  <%- HYGEN ? '' : '&& npx fse remove --quiet .hygen.js' %>
  <%- HYGEN ? '' : '&& npx fse remove --quiet _templates' %>
  <%- HYGEN ? '' : '&& npx fse remove --quiet .scripts' %>
"
---
