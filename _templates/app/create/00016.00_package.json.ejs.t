---
to: <%= h.root(`${ROOT}/package.json`) %>
force: true
---
{
  "name": "<%= APP_NAME %>",
  "private": true,
  "version": "0.0.0",
  "description": "<%= APP_DESCRIPTION %>",
  "keywords": [],
  "author": "llevkin",
  "license": "UNLICENSED",
  "scripts": {
    "build": "npx lerna run build --stream --no-prefix --scope <%= CLIENT_NAME %> --scope <%= SERVER_NAME %>",
    "start": "pnpm --prefix apps/<%= SERVER_NAME %> start",
    "build:debug": "npx lerna run build:debug --stream --no-prefix --scope <%= CLIENT_NAME %>",
    "start:debug": "npx lerna run start:debug --stream --no-prefix --scope <%= SERVER_NAME %>",
    "test": "npx lerna run test --stream --no-prefix --scope <%= SERVER_NAME %> --scope <%= CLIENT_NAME %>",
    "migrations": "npx lerna run migrations --stream --no-prefix --scope <%= SERVER_NAME %>",
    "test:server": "npx lerna run test --stream --no-prefix --scope <%= SERVER_NAME %>",
    "test:client": "npx lerna run test --stream --no-prefix --scope <%= CLIENT_NAME %>",
    "version": "npx lerna version",
    "cleanup:node_modules": "rm -rf $(find -type d -name 'node_modules')",
    "prepare": "npx husky install",
    "allure:report": "npx lerna run allure:report --scope <%= SERVER_NAME %> --scope <%= CLIENT_NAME %>",
    "hooks:pre-commit": "npx lerna run hooks:pre-commit --scope <%= SERVER_NAME %> --scope <%= CLIENT_NAME %>",
    "ls-lint": "npx ls-lint"
  },
  "engines": {
    "yarn": ">=1.22.22",
    "pnpm": ">=9.7.1",
    "npm": ">=10.8.2",
    "node": "=20"
  },
  "workspaces": [
    "apps/*/**",
    "packages/*/**"
  ],
  "resolutions": {
    "mem": "4.0.0",
    "got": "11.8.5",
    "deep-extend": "0.5.1",
    <%- CLIENT ? '"postcss": "8.4.31",' : '' %>
    "json5": "1.0.2",
    <%- CLIENT ? '"pug": "3.0.1",' : '' %>
    "loader-utils": "1.4.2",
    "semver": "7.5.2"
    <%- CLIENT ? ',"styled-components": "6.1.8"' : '' %>
  },
  "overrides": {
    "mem": "4.0.0",
    "got": "11.8.5",
    "deep-extend": "0.5.1",
    <%- CLIENT ? '"postcss": "8.4.31",' : '' %>
    "json5": "1.0.2",
    <%- CLIENT ? '"pug": "3.0.1",' : '' %>
    "loader-utils": "1.4.2",
    "semver": "7.5.2"
    <%- CLIENT ? ',"styled-components": "6.1.8"' : '' %>
  },
  "devDependencies": {
    "@atao60/fse-cli": "0.1.9",
    "@ls-lint/ls-lint": "2.2.3",
    "@types/chai": "4.2.18",
    "@types/flat": "5.0.2",
    "@types/lodash": "4.14.170",
    "@types/minimist": "1.2.5",
    "@types/mocha": "8.2.2",
    "@types/node": "15.0.2",
    "@types/traverse": "0.6.32",
    "@typescript-eslint/eslint-plugin": "5.37.0",
    "@typescript-eslint/parser": "5.00.0",
    "allure-commandline": "2.25.0",
    "allure-js-commons": "2.14.1",
    "chai": "4.3.4",
    "cookies": "0.8.0",
    <%- CLIENT ? '"css-loader": "5.2.6",' : '' %>
    <%- CLIENT ? '"css-minimizer-webpack-plugin": "3.0.0",' : '' %>
    "eslint": "7.32.0",
    "eslint-config-airbnb-typescript": "17.0.0",
    "eslint-config-prettier": "8.3.0",
    "eslint-plugin-prettier": "3.4.0",
    <%- CLIENT ? '"eslint-plugin-react": "7.31.10",' : '' %>
    <%- CLIENT ? '"eslint-plugin-react-hooks": "4.6.0",' : '' %>
    <%- CLIENT ? '"file-loader": "6.2.0",' : '' %>
    <%- HYGEN ? '"hygen": "6.2.11",' : '' %>
    "lerna": "6.6.2",
    <%- CLIENT ? '"less": "4.1.1",' : '' %>
    <%- CLIENT ? '"less-loader": "9.0.0",' : '' %>
    <%- CLIENT ? '"mini-css-extract-plugin": "1.6.0",' : '' %>
    "minimist": "1.2.6",
    "node-gyp": "8.4.1",
    "npx": "3.0.0",
    "nx": "15.9.7",
    "nyc": "15.1.0",
    <%- CLIENT ? '"postcss-less": "6.0.0",' : '' %>
    <%- CLIENT ? '"postcss-loader": "7.0.0",' : '' %>
    <%- CLIENT ? '"postcss-scss": "4.0.9",' : '' %>
    <%- CLIENT ? '"postcss-styled-syntax": "0.6.4",' : '' %>
    "prettier": "2.8.8",
    <%- CLIENT ? '"pug-html-loader": "1.1.5",' : '' %>
    <%- CLIENT ? '"path-browserify": "1.0.1",' : '' %>
    <%- CLIENT ? '"process": "0.11.10",' : '' %>
    <%- CLIENT ? '"style-loader": "3.3.1",' : '' %>
    <%- CLIENT ? '"stylelint": "15",' : '' %>
    <%- CLIENT ? '"stylelint-config-idiomatic-order": "10.0.0",' : '' %>
    <%- CLIENT ? '"stylelint-config-standard": "34",' : '' %>
    <%- CLIENT ? '"stylelint-csstree-validator": "3.0.0",' : '' %>
    <%- CLIENT ? '"stylelint-order": "6.0.4",' : '' %>
    <%- CLIENT ? '"terser-webpack-plugin": "5.1.2",' : '' %>
    "traverse": "0.6.6",
    <%- CLIENT ? '"ts-loader": "9.5.1",' : '' %>
    "ts-node": "10.9.1",
    "typedoc": "0.24.8",
    "typescript": "5.0.4"<%- CLIENT ? ',' : '' %>
    <%- CLIENT ? '"util-browserify": "browserify/node-util#v0.12.4",' : '' %>
    <%- CLIENT ? '"webpack": "5.97.1",' : '' %>
    <%- CLIENT ? '"webpack-cli": "6.0.1",' : '' %>
    <%- CLIENT ? '"webpack-dev-server": "5.2.0"' : '' %>
  },
  "dependencies": {
    "@biorate/auto-object": "1.122.0",
    "@biorate/axios": "1.120.0",
    "@biorate/config": "1.120.0",
    "@biorate/errors": "1.102.0",
    "@biorate/i18n": "1.120.0",
    "@biorate/inversion": "1.120.0",
    "@biorate/symbolic": "1.102.0",
    "@biorate/tools": "1.102.1",
    "cross-env": "7.0.3",
    "husky": "8.0.3",
    "i18next": "23.4.2",
    "lodash": "4.17.21"
  }
}
