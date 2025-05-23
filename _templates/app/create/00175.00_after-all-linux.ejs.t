---
sh: "
  <%- h.platform === 'linux' ? `chmod ug+x ${ROOT}/.husky/*` : '' %>
"
---
