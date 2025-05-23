(async () => {
  const fs = require('fs');
  const pt = require('path');
  const https = require('https');

  const registry = 'https://registry.npmjs.org/';
  const path = (...args) => pt.normalize(pt.join(...args));
  const templatePath = './_templates/app/create/';
  const dir = path(process.cwd(), templatePath);
  const files = fs.readdirSync(dir).filter((item) => /package.json/.test(item));
  const regexp = /"(@biorate\/[^"]+)":\s*"([^"]+)"/g;

  for (const file of files) {
    const p = path(dir, file);
    let data = fs.readFileSync(p, 'utf-8');
    const matches = [...data.matchAll(regexp)];
    for (const match of matches) {
      const line = match[0];
      const name = match[1];
      const oldVersion = match[2];
      const latestVersion = await version(name);
      const newVersion = `"${name}": "${latestVersion}"`;
      if (latestVersion === oldVersion) continue;
      data = data.replace(line, newVersion);
      console.info(name, oldVersion, '->', latestVersion);
    }
    fs.writeFileSync(p, data, 'utf8');
  }

  async function version(packageName) {
    return new Promise((resolve, reject) => {
      https.get(`${registry}${packageName}`, (res) => {
        let data = '';
        res.on('data', (d) => (data += d));
        res.on('end', () => resolve(JSON.parse(data)['dist-tags'].latest));
      });
    });
  }
})();
