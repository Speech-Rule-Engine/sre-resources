
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
    console.log(SRE.variables.LOCALES);
    console.log(features.locale);
    let promise = SRE.setupEngine(features);
    PROM = promise;
    return promise.then(() => {return sreTest.test('test1');})
      .then(() => {return sreTest.test('test2');})
      .then(() => {return sreTest.test('test3');});
  },

  runAllTests: async function() {
    await sreTest.runTests();
    for (let locale of SRE.variables.LOCALES.keys()) {
      if (locale === 'nemeth') continue;
      await sreTest.runTests({locale: locale, domain: 'mathspeak', style: 'default'});
      await sreTest.runTests({locale: locale, domain: 'clearspeak', style: 'default'});
    }
    await sreTest.runTests({locale: 'nemeth', domain: 'default', modality: 'braille'});
  }
  
};
