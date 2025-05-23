const os = require('os');
const fs = require('fs');
const pt = require('path');
const _ = require('lodash');
const argv = require('minimist')(process.argv);

const normalize = (...args) => pt.normalize(pt.join(...args));
const cwd = process.cwd();
const root = normalize(cwd, argv._[2]);
const dest = normalize(cwd, argv._[3]);
const indexFrom = argv.i ? parseInt(argv.i) : 0;
const replacemets = argv.r ? argv.r.split(',') : [];

function scan(root, dir = root, result = []) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const path = normalize(dir, item);
    if (/node_modules/.test(path)) continue;
    const stat = fs.statSync(path);
    if (stat.isDirectory()) {
      scan(root, path, result);
    } else if (stat.isFile()) {
      result.push(path);
    }
  }
  return result;
}

const files = scan(root);

for (let i = 0; i < files.length; i++) {
  const file = files[i];
  let path = file.replace(cwd, '');
  for (const replacemet of replacemets) {
    const [from, to] = replacemet.split(':');
    if (from && to) path = path.replace(from, to);
  }
  let template = `---${os.EOL}`;
  template += `to: <%= h.server(\`\${ROOT}${path}\`) %>${os.EOL}`; //TODO: client / server
  template += `unless_exists: true${os.EOL}`;
  template += `---${os.EOL}`;
  template += fs.readFileSync(file, 'utf8');
  let index = (indexFrom + (argv.d ? i : 0)).toString();
  index = _.repeat('0', 5 - index.length) + index + '.00';
  let filename =
    index + '_' + path.slice(1).replace(new RegExp(pt.sep, 'g'), '_') + '.ejs.t';
  fs.writeFileSync(normalize(dest, filename), template, 'utf8');
}
