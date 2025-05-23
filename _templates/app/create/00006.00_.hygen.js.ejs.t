---
to: <%= h.hygen(`${ROOT}/.hygen.js`) %>
unless_exists: true
---
const minimist = require('minimist');
const argv = minimist(process.argv);

module.exports = {
  helpers: {
    server: (path) => (argv.server ? path : null),
    client: (path) => (argv.client ? path : null),
    hygen: (path) => (argv.hygen ? path : null),
    root: (path) => path,
    defined: (args) => {
      for (const field in args)
        if (typeof args[field] === 'undefined')
          throw new Error(`[${field}] in not defined`);
    },
  },
};
