---
to: <%= h.server(`${ROOT}/apps/${SERVER_NAME}/tsconfig.build.json`) %>
unless_exists: true
---
{
  "extends": "./tsconfig.json",
  "include": ["index.ts", "src/**/*"],
  "exclude": ["node_modules", "dist", "tests/**/*"]
}
