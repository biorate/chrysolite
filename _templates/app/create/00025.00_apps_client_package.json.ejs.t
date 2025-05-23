---
to: <%= h.client(`${ROOT}/apps/${CLIENT_NAME}/package.json`) %>
unless_exists: true
---
{
  "name": "<%= CLIENT_NAME %>",
  "version": "0.0.0",
  "description": "<%= APP_DESCRIPTION %> (client application)",
  "main": "dist",
  "scripts": {
    "build": "cross-env NODE_ENV=production npx webpack --config=webpack.config.js --mode=production --entry=./src/index.tsx --entry=./src/index.pug --entry=./src/index.less -o ./dist",
    "build:debug": "npx webpack serve --history-api-fallback --config=webpack.config.js --mode=development --hot --open --entry=./src/index.tsx --entry=./src/index.pug --entry=./src/index.less -o ./dist",
    "test": "npx playwright test",
    "test:ui": "npx playwright test --ui",
    "prettier:fix": "npx prettier --write ./src",
    "lint:fix": "npx eslint --fix ./src",
    "stylelint:fix": "npx stylelint './src/**/*.{less,css,scss,sass,tsx}' --fix",
    "allure:report": "npx allure serve allure-results --clean -o allure-report",
    "hooks:pre-commit": "pnpm run prettier:fix && pnpm run lint:fix && pnpm run stylelint:fix"
  },
  "keywords": [],
  "author": "llevkin",
  "license": "UNLICENSED",
  "devDependencies": {
    "@ant-design/icons": "4.7.0",
    "@biorate/playwright": "1.106.0",
    "@types/react": "^18.0.37",
    "@types/react-dom": "^18.0.11",
    "classnames": "^2.3.1",
    "history": "^5.3.0",
    "i18next-browser-languagedetector": "^7.1.0",
    "i18next-http-backend": "^2.2.1",
    "mobx": "^6.5.0",
    "mobx-react": "^7.3.0",
    "playwright": "^1.40.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router": "^6.15.0",
    "react-router-dom": "^6.15.0",
    "styled-components": "^6.1.8"
  }
}
