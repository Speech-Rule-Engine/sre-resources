let fs = require('fs');
let json = require('./tmp1').tmp;
let locale = 'Nemeth';
let newname = 'default';
let name = newname[0].toUpperCase() + newname.slice(1);
json.information = json.name;
fs.writeFileSync('tmp2', JSON.stringify(json, null, 2));
let tests = json.tests;
delete json.tests;
let newjson = {};
Object.assign(newjson, json);
let chars = tests[name + 'Chars'];
newjson.tests = chars;
newjson.name = name + 'Character' + locale + 'Test';
newjson.active = name + 'Character' + locale;
newjson.basename = 'json/common/characters.json';
newjson.information = `${name} Character Test for ${locale}`;
fs.writeFileSync(newname + '_characters.json', JSON.stringify(newjson, null, 2));
chars = tests[name + 'Functions'];
newjson.tests = chars;
newjson.type = 'function';
newjson.name = name + 'Function' + locale + 'Test';
newjson.active = name + 'Function' + locale;
newjson.basename = 'json/common/functions.json';
newjson.information = `${name} function test for ${locale}`;
fs.writeFileSync(newname + '_functions.json', JSON.stringify(newjson, null, 2));
chars = tests[name + 'Units'];
newjson.tests = chars;
newjson.type = 'unit';
newjson.name = name + 'Unit' + locale + 'Test';
newjson.active = name + 'Unit' + locale;
newjson.basename = 'json/common/units.json';
newjson.information = `${name} unit test for ${locale}`;
fs.writeFileSync(newname + '_units.json', JSON.stringify(newjson, null, 2));

