let rew = {};
let files = ['semantic_tree_test.js', 'enrich_mathml_test.js', 'rebuild_stree_test.js', 'enrich_speech_test.js'];

rew.rewrite = function(filename) {
  let fs = require('fs');
  let name = filename.split('.')[0];
  name = name.split('/').reverse()[0];
  filename = './' + filename;
  let file = fs.readFileSync(filename).toString();
  let split = file.split('};');
  let result = [];
  for (let func of split) {
    let match = func.match(/(.*) = function\(\) {/);
    if (match) {
      let name = match[1];
      let count = 0;
      while (func.match(/this\.execute.*Test/)) {
        func = func.replace(/this\.execute.*Test\(/, `"${name}_${count}": {\n "mathml":`);
        count++;
      }
      func = func.replace(/',(?:\r\n|\r|\n)/g, '\',\n "expected": ');
      func = func.replace(/\);/, '},');
      func = func.replace(/(.*) = function\(\) {/, '');
    }
    result.push(func);
  }
  file = result.join('\n');
  file = rew.comments(file);
  file = file.replace(/this\.information = (.*);/, '"information": $1,');
  fs.writeFileSync(`${name}-tmp.js`, file);
  nix = file;
  file = rew.this(file);
  file = file.replace(/\);/g, '},');
  file = 'module.exports.tmp = {\n' + file + '\n}';
  fs.writeFileSync(`${name}-tmp2.js`, file);
  fs.writeFileSync(`${name}-tmp3.json`, JSON.stringify(require(`./${name}-tmp2.js`).tmp, null, 2));
};


rew.this = function(str) {
  // Find a this
  // Rewrite and
  // swap with the next line
  let count = 0;
  while (str.match(/this\.(.*) = (.*);/)) {
    let match = str.match(/this\.(.*) = (.*);/);
    let before = str.slice(0, match.index);
    let after = str.slice(match.index + match[0].length);
    let match2 = after.match(/ *".*": {/);
    let before2 = after.slice(0, match2.index + match2[0].length);
    let after2 = after.slice(match2.index + match2[0].length);
    // Maybe make that safe?
      // str.replace(/this\.(.*) = (.*);\n([\n\r.]* {\n)/, '$3\n"$1": $2,');
    str = `${before} ${before2}\n"${match[1]}": ${match[2]},${after2}`;
    count++;
  }
  return str;
};


rew.comments = function(str) {
  let count = 0;
  while (str.match(/\/\//)) {
    str = str.replace(/\/\/(.*)\n/, `"comment_${count}": "$1",\n`);
    count++;
  }
  return str;
};

rew.name = function(name) {
  let split = name('_');
  let result = [];
  for (let part of split) {
    result.push(part[0].toUpperCase() + part.slice(1));
  }
  return result.join('');
};
