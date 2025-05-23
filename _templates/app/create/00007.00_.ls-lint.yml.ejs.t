---
to: <%= h.root(`${ROOT}/.ls-lint.yml`) %>
unless_exists: true
---
ls:
  .js: lowercase
  .jsx: lowercase
  .ts: lowercase
  .tsx: lowercase
  .css: lowercase
ignore:
  - node_modules
  - .git
  - .vscode
  - build
  - public
  - dist
  - web-components
