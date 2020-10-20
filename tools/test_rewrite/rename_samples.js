// Renames tests called Sample_? with Name_X_?, where name is the previous proper name.
// Careful, do not use on Noble_samples!
let fs = require('fs');
let json = JSON.parse(fs.readFileSync('./tmp2'));
let lastName = null;
let lastSample = null;
let count = 0;
let rename = {}; // or do it directly?
let held = [];

let nemeth = process.argv.indexOf('nemeth') !== -1;
// Temporary removed the underscore _
for (let key of Object.keys(json.tests)) {
  if (key.match(/^_.*/)) continue;
  if (key.match(new RegExp('^' + lastName))) {
    held.push(key);
    continue;
  }
  if (key.match(/^Sample.*/)) {
  // if (key.match(/^Sample.*_/)) {
    held.forEach(x => {
      let rest = x.split('_').slice(1);
      rename[x] = (!nemeth && rest.length) ? lastName + '_0_' + rest.join('_') : lastName + '_0';
    });
    held = [];
    let samples = key.split('_');
    if (samples[0] !== lastSample) {
      lastSample = samples[0];
      count++;
    }
    let rest = samples.slice(1);
    rename[key] = (!nemeth && rest.length) ? lastName + '_' + count + '_' + rest.join('_') : lastName + '_' + count;
    continue;
  }
  held = [];
  lastName = nemeth ? key : key.split('_')[0];
  count = 0;
  held.push(key);
}

let newJson = JSON.stringify(json, null, 2);

// Singleton cleanup.
// let zeroes = Object.keys(rename).filter(x => x.match(/^[a-zA-Z0-9]*_0_default$/));
// for (let zero of zeroes) {
//   if (!rename[zero.replace(/_0_/, '_1_')]) {
    
//   }
// }

// Renaming
for (let key of Object.keys(rename)) {
  console.log(key);
  console.log(rename[key]);
  newJson = newJson.replace(key, rename[key]);
}
fs.writeFileSync('tmp3', newJson);

