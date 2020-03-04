var tests = function() {
  runTests();
  for (let loc of sre.Variables.LOCALES) {
    SRE.setupEngine({locale: loc, domain: loc === 'nemeth' ? 'default' : 'mathspeak'});
    runTests();
  }
};


var runTests = function() {
  if (!SRE.engineReady()) {
    setTimeout(runTests, 200);
    return;
  }
  var xmls = new sre.SystemExternal.xmldom.XMLSerializer();
  var test1 = xmls.serializeToString(document.getElementById('test1'));
  var test2 = xmls.serializeToString(document.getElementById('test2'));
  var test3 = xmls.serializeToString(document.getElementById('test3'));
  console.log(SRE.toSpeech(test1));
  console.log(SRE.toSpeech(test2));
  console.log(SRE.toSpeech(test3));
};
