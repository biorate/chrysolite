---
to: <%= h.root(`${ROOT}/.husky/pre-commit`) %>
unless_exists: true
---
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

pnpm run hooks:pre-commit
