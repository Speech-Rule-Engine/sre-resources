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
    var xmls = new sre.SystemExternal.xmldom.XMLSerializer();
    var test = xmls.serializeToString(document.getElementById(id));
    console.log(SRE.toSpeech(test));
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
        then(() => {return sreTest.runTests({locale: 'fr'});}).
        then(() => {return sreTest.runTests({locale: 'es', domain: 'mathspeak', style: 'default'});}).
        then(() => {return sreTest.runTests({locale: 'nemeth', domain: 'default', modality: 'braille'});});
    });
  }
  
}
