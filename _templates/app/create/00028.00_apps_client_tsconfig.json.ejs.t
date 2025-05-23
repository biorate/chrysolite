---
to: <%= h.client(`${ROOT}/apps/${CLIENT_NAME}/tsconfig.json`) %>
unless_exists: true
---
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "strict": true,
    "strictPropertyInitialization": false,
    "esModuleInterop": true
  },
  "include": ["src/**/*", "tests/**/*"],
  "exclude": ["node_modules", "dist"]
}
