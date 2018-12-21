const yaml = require('js-yaml');
const fs = require('fs');

let doc;

try {
  doc = yaml.safeLoad(fs.readFileSync('config.yaml', 'utf8'));
} catch (e) {
  console.log(e);
}

module.exports = doc;
