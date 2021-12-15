let sreTest = {

  test: function(id) {
    // const xmls = new sre.SystemExternal.xmldom.XMLSerializer();
    const xmls = new XMLSerializer();
    const element = document.getElementById(id);
    const next = element.nextSibling;
    const test = xmls.serializeToString(element);
    const speech = SRE.toSpeech(test);
    const div = document.createElement('div');
    div.textContent = speech;
    document.body.insertBefore(div, next);
    // console.log('Trie in lib');
    // console.log(sre.SpeechRuleEngine.getInstance().activeStore_.trie.byConstraint(['nemeth']));
    // console.log(speech);
  },


  runTests: function(features = {}) {
    let promise = SRE.setupEngine(features);
    PROM = promise;
    return promise.then(() => {return sreTest.test('test1');})
      .then(() => {return sreTest.test('test2');})
      .then(() => {return sreTest.test('test3');});
  },

  runAllTests: function() {
    sreTest.runTests().
      then(() => {return sreTest.runTests({locale: 'en', domain: 'mathspeak', style: 'default'});}).
      then(() => {return sreTest.runTests({locale: 'en', domain: 'clearspeak', style: 'default'});}).
      then(() => {return sreTest.runTests({locale: 'fr', domain: 'mathspeak', style: 'default'});}).
      then(() => {return sreTest.runTests({locale: 'fr', domain: 'clearspeak', style: 'default'});}).
      then(() => {return sreTest.runTests({locale: 'es', domain: 'mathspeak', style: 'default'});}).
      then(() => {return sreTest.runTests({locale: 'it', domain: 'mathspeak', style: 'default'});}).
      then(() => {return sreTest.runTests({locale: 'it', domain: 'clearspeak', style: 'default'});}).
      then(() => {return sreTest.runTests({locale: 'de', domain: 'mathspeak', style: 'default'});}).
      then(() => {return sreTest.runTests({locale: 'de', domain: 'clearspeak', style: 'default'});}).
      then(() => {return sreTest.runTests({locale: 'hi', domain: 'mathspeak', style: 'default'});}).
      then(() => {return sreTest.runTests({locale: 'hi', domain: 'clearspeak', style: 'default'});}).
      then(() => {return sreTest.runTests({locale: 'ca', domain: 'mathspeak', style: 'default'});}).
      then(() => {return sreTest.runTests({locale: 'nn', domain: 'mathspeak', style: 'default'});}).
      then(() => {return sreTest.runTests({locale: 'nn', domain: 'clearspeak', style: 'default'});}).
      then(() => {return sreTest.runTests({locale: 'nb', domain: 'mathspeak', style: 'default'});}).
      then(() => {return sreTest.runTests({locale: 'nb', domain: 'clearspeak', style: 'default'});}).
      then(() => {return sreTest.runTests({locale: 'nemeth', domain: 'default', modality: 'braille'});});
  }
  
};
