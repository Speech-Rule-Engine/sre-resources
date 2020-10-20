require('/home/sorge/git/sre/speech-rule-engine/lib/sre4node');

require('/special/sorge/git/sre/speech-rule-engine/tests/deps.js');
goog.require('sre.Tests');

let FillTest = {};

FillTest.loadFiles = function(expected, base) {
  expected = sre.TestUtil.fileExists(expected);
  base = sre.TestUtil.fileExists(base);
  return [sre.TestUtil.loadJson(expected), sre.TestUtil.loadJson(base)];
};


FillTest.findMissing = function(expected, base) {
  let [output, input] = FillTest.loadFiles(expected, base);
  let [tests, warn] = sre.TestUtil.combineTests(
      input.tests, output.tests, output.expected || []);
  return [warn, input.tests];
};


FillTest.runMissing = function(missing, base, constructor) {
  let obj = new constructor();
  let result = {};
  try {
    obj.setUpTest();
  } catch (e) {}
  for (let miss of missing) {
    console.log(miss);
    let test = base[miss];
    test.expected = '';
    try {
      obj.method.apply(obj, obj.pick(test));
    } catch (e) {
      result[miss] = {"expected": e.actual};
    }
  }
  try {
    obj.tearDownTest();
  } catch (e) {}
  return JSON.stringify(result, null, 2);
};


FillTest.missingTests = function(expected, base, constructor) {
  let [missing, tests] = FillTest.findMissing(expected, base);
  console.log(FillTest.runMissing(missing, tests, constructor));
};


FillTest.runTest = function(expected, constructor) {
  let obj = new constructor();
  obj.jsonFile = expected;
  let missing = [];
  try {
    obj.prepare();
  } catch (e) {
    missing = e.value;
  }
  // let [missing, tests] = FillTest.findMissing(expected, obj.baseFile);
  let result = {};
  try {
    obj.setUpTest();
  } catch (e) {}
  let tests = obj.baseTests.tests;
  for (let miss of missing) {
    let test = tests[miss];
    test.expected = '';
    try {
      obj.method.apply(obj, obj.pick(test));
    } catch (e) {
      result[miss] = {"expected": e.actual};
    }
  }
  try {
    obj.tearDownTest();
  } catch (e) {}
  return JSON.stringify(result, null, 2);
};


