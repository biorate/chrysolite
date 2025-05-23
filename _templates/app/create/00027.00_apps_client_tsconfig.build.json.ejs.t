---
to: <%= h.client(`${ROOT}/apps/${CLIENT_NAME}/tsconfig.build.json`) %>
unless_exists: true
---
{
  "extends": "./tsconfig.json",
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests/**/*"]
}
