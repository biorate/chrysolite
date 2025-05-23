const fs = require('fs');
const pt = require('path');
const _ = require('lodash');
const argv = require('minimist')(process.argv);

const normalize = (...args) => pt.normalize(pt.join(...args));
const cwd = process.cwd();
const dir = normalize(cwd, argv._[2]);
const files = fs.readdirSync(dir);
const regexp = /\d{5}\.\d{2}_.+/;

for (let i = 0; i < files.length; i++) {
  const file = files[i];
  if (!regexp.test(file)) continue;
  if (!fs.statSync(normalize(dir, file)).isFile()) continue;
  const name = file.split('_');
  name[0] = _.repeat('0', 5 - i.toString().length) + i + '.00';
  fs.renameSync(normalize(dir, file), normalize(dir, name.join('_')));
}
