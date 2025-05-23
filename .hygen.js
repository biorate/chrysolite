const minimist = require('minimist');
const path = require('path');
const { execSync } = require('child_process');
const { platform } = require('os');
const _ = require('lodash');
const argv = minimist(process.argv);

module.exports = {
  helpers: {
    _,
    server: (path) => (argv.server && typeof path === 'string' ? path : null),
    client: (path) => (argv.client && typeof path === 'string' ? path : null),
    hygen: (path) => (argv.hygen && typeof path === 'string' ? path : null),
    stringify: (data) => JSON.stringify(data),
    root: (path) => path,
    defined: (args) => {
      for (const field in args)
        if (typeof args[field] === 'undefined')
          throw new Error(`[--${_.kebabCase(field)}] in not defined`);
    },
    get platform() {
      return platform();
    }
  },
};
