let sreTest = {

  setup: function(features) {
    SRE.setupEngine(features);
    let count = 0;
    return new Promise((res, rej) => {
      function checkSRE() {
        if (SRE && SRE.engineReady()) {
          res();
        } else if (count < 30) {
          count++;
          setTimeout(checkSRE, 200);
        } else {
          rej();
        }
      }
      checkSRE();
    });
  },
  
  test: function(id) {
    const xmls = new sre.SystemExternal.xmldom.XMLSerializer();
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
    let promise = sreTest.setup(features);
    return promise.then(() => {return sreTest.test('test1');})
      .then(() => {return sreTest.test('test2');})
      .then(() => {return sreTest.test('test3');});
  },

  runAllTests: function() {
    // Edge takes too long to render. So a little timeout!
    let promise = new Promise((res, rej) => {
      if (sre.Engine.getInstance().isEdge || sre.Engine.getInstance().isIE) {
        setTimeout(res(), 200);
      } else {
        res();
      }
    });
    promise.then(() => {
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
        then(() => {return sreTest.runTests({locale: 'nemeth', domain: 'default', modality: 'braille'});});
    });
  }
  
};
