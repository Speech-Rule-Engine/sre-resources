require('/home/sorge/git/sre/speech-rule-engine/lib/sre4node');
const fs = require('fs');
const path = require('path');

const testDir = '/home/sorge/git/sre/sre-tests/';
const inputDir = testDir + 'input/common/';
const expectedDir = testDir + 'expected';

let FILES = {
  units: inputDir + 'units.json',
  si_units: inputDir + 'si_units.json',
  characters: inputDir + 'characters.json',
  functions: inputDir + 'functions.json'
};


let loadBaseFile = function(file) {
  return Object.keys(JSON.parse(fs.readFileSync(file)).tests);
};


let getCharOutput = function(dom, modality, loc, style, char) {
  let aural = sre.AuralRendering.getInstance();
  sre.SpeechRuleEngine.getInstance().clearCache();
  sre.System.getInstance().setupEngine({
    domain: dom, modality: modality, locale: loc, style: style});
  let grammar = {translate: true};
  let descrs = [
    sre.AuditoryDescription.create({text: char}, {adjust: true, translate: true})];
  return aural.finalize(aural.markup(descrs));
};

let getUnitOutput = function(dom, modality, loc, style, unit) {
  sre.Grammar.getInstance().pushState({annotation: 'unit'});
  let output = getCharOutput(dom, modality, loc, style, unit);
  sre.Grammar.getInstance().popState();
  return output;
};

let getOutput = function(dom, modality, loc, style, char, unit = false) {
  return unit ? getUnitOutput(dom, modality, loc, style, char) :
    getCharOutput(dom, modality, loc, style, char);
};

let AllConstraints = {
    en: {
      default: ['default'],
      mathspeak: ['default', 'brief', 'sbrief'],
      clearspeak: ['default']
    },
    es: {
      default: ['default'],
      mathspeak: ['default', 'brief', 'sbrief']
    },
    fr: {
      default: ['default'],
      mathspeak: ['default', 'brief', 'sbrief'],
      clearspeak: ['default']
    },
    de: {
      default: ['default'],
      mathspeak: ['default', 'brief', 'sbrief'],
      clearspeak: ['default']
    },
    nemeth: {
      default: ['default']
    }
  };



/**
 * Gets all the expected values for a given locale for the tests in the base file.
 * @param {string} locale The locale.
 * @param {string} keys The keys for symbols to test.
 * @param {boolean} unit Is it his unit tests.
 * @return {Object.<json>} The test json structure.
 */
let testOutput = function(locale, keys, unit = false) {
  let constraints = AllConstraints[locale];
  if (!constraints) {
    return {};
  }
  let output = {};
  let modality = locale === 'nemeth' ? 'braille' : 'speech';
  for (let dom of Object.keys(constraints)) {
    let json = { "name": "",
                 "locale": locale,
                 "domain": dom,
                 "styles": constraints[dom]
               };
    let tests = {};
    for (let key of keys) {
      if (key.match(/^_comment/)) continue;
      let expected = [];
      for (let style of constraints[dom]) {
        let result = getOutput(dom, modality, locale, style, key, unit);
        expected.push(result);
      }
      tests[key] = {"expected": expected};
    }
    json.tests = tests;
    output[dom] = json;
  }
  return output;
};


let isUnitTest = function(kind) {
  return kind === 'units' || kind === 'si_units';
};


let testFromBase = function(locale, kind) {
  let file = FILES[kind];
  if (!file) return [];
  let keys = loadBaseFile(file);
  return testOutput(locale, keys, isUnitTest(kind));
}

// Loads the locale symbol file from mathmaps.
let testFromLocale = function(locale, kind) {
  let file = sre.BaseUtil.makePath(sre.SystemExternal.jsonPath) +
      locale + '.js';
  let json = JSON.parse(sre.MathMap.loadFile(file));
  let keys = getNamesFor(json, kind);
  return testOutput(locale, keys, isUnitTest(kind));
  
};

// Run with e.g.:
// testOutputFromBase('de', 'units');
/**
 * Gets all the expected values for a given locale for the tests in the base file.
 * @param {string} locale The locale.
 * @param {string} kind The kind of symbol for which to generate tests.
 * @param {string=} dir Output directory.
 */
let testOutputFromBase = function(locale, kind, dir = '/tmp') {
  let output = testFromBase(locale, kind);
  for (let [dom, json] of Object.entries(output)) {
    writeOutputToFile(dir, json, locale, dom, kind);
  }
};

let testOutputFromLocale = function(locale, kind, dir = '/tmp') {
  let output = testFromLocale(locale, kind);
  for (let [dom, json] of Object.entries(output)) {
    writeOutputToFile(dir, json, locale, dom, kind);
  }
};

let testOutputFromBoth = function(locale, kind, dir = '/tmp') {
  let output = testFromBase(locale, kind);
  let comp = diffBaseVsLocale(locale, kind);
  for (let [dom, json] of Object.entries(output)) {
    let [base, loc] = comp[dom];
    if (Object.keys(base).length && kind !== 'characters') {
      json.exclude = Object.keys(base);
    }
    Object.assign(json.tests, loc);
    writeOutputToFile(dir, json, locale, dom, kind);
  }
};

let writeOutputToFile = function(dir, json, locale, dom, kind) {
  if (dir) {
    fs.mkdirSync(`${dir}/${locale}`, {recursive: true});
    fs.writeFileSync(`${dir}/${locale}/${dom}_${kind}.json`, JSON.stringify(json, null, 2));
  }
};


// TODO: the si units!
let getNamesFor = function(json, kind) {
  let keys = Object.keys(json);
  let si = kind === 'si_units';
  let symbols = keys.filter(j => j.match(RegExp(`^.+/${si ? 'units' : kind}/.+\.js`)));
  let prefixes = json[keys.find(j => j.match(/^.+\/si\/prefixes\.js/))][0];
  let result = [];
  for (let key of symbols) {
    for (let obj of Object.values(json[key])) {
      if (si && obj.names && obj.si) {        
        result = result.concat(getSINamesFor(prefixes, obj.names));
        continue;
      }
      if (!si && obj.names && !obj.si) {
        result = result.concat(obj.names);
      }
    }
  }
  return result;
};


// Generates the SI unit names
let getSINamesFor = function(prefixes, names) {
  let result = [];
  prefixes = Object.keys(prefixes);
  for (const name of names) {
    result = result.concat(prefixes.map(p => p + name));
    result.push(name);
  }
  return result;
};


// Difference between base file and locale. Returns only elements that are not
// in both.
// 
// One is from base tests
// Two is from locale
let diffBaseVsLocale = function(locale, kind) {
  let output1 = testFromBase(locale, kind);
  let output2 = testFromLocale(locale, kind);
  let result = {};
  for (const dom of Object.keys(output1)) {
    let tests1 = output1[dom].tests;
    let tests2 = output2[dom].tests;
    for (const key of Object.keys(tests1)) {
      if (key.match(/^_comment/)) console.log(key);
      if (tests2[key]) {
        delete tests2[key];
        delete tests1[key];
      }
    }
    result[dom] = [tests1, tests2];
  }
  return result;
};


let allTests = function(dir = '/tmp/symbols') {
  let symbols = ['characters', 'functions', 'units', 'si_units'];
  for (let loc of sre.Variables.LOCALES) {
    symbols.forEach(x => testOutputFromBoth(loc, x, dir));
  }
};


var replaceTests = function(dir = '/tmp/symbols') {
  let locales = fs.readdirSync(dir);
  for (let loc of locales) {
    let files = fs.readdirSync(`${dir}/${loc}`);
    for (let file of files) {
      console.log(file);
      let oldJson = JSON.parse(
        fs.readFileSync(`${expectedDir}/${loc}/symbols/${file}`));
      let newJson = JSON.parse(fs.readFileSync(`${dir}/${loc}/${file}`));
      oldJson.tests = newJson.tests;
      fs.writeFileSync(`${expectedDir}/${loc}/symbols/${file}`,
                       JSON.stringify(oldJson, null, 2) + '\n');
    }
  }
};
