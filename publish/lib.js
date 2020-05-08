var tests = function() {
  runTests();
  for (let loc of sre.Variables.LOCALES) {
    runTests(loc);
  }
};


// var runTests = function() {
//   if (!SRE.engineReady()) {
//     setTimeout(runTests, 200);
//     return;
//   }
//   var xmls = new sre.SystemExternal.xmldom.XMLSerializer();
//   var test1 = xmls.serializeToString(document.getElementById('test1'));
//   var test2 = xmls.serializeToString(document.getElementById('test2'));
//   var test3 = xmls.serializeToString(document.getElementById('test3'));
//   console.log(SRE.toSpeech(test1));
//   console.log(SRE.toSpeech(test2));
//   console.log(SRE.toSpeech(test3));
// };


var runTests = function(loc) {
  SRE.setupEngine({locale: loc, domain: loc === 'nemeth' ? 'default' : 'mathspeak'});
  var xmls = new sre.SystemExternal.xmldom.XMLSerializer();
  var test1 = xmls.serializeToString(document.getElementById('test1'));
  var test2 = xmls.serializeToString(document.getElementById('test2'));
  var test3 = xmls.serializeToString(document.getElementById('test3'));
  let toSpeechAsync = function(x) {
    let count = 0;
    return new Promise((res, rej) => {
      function checkSRE() {
        if (SRE && SRE.engineReady()) {
          console.log(SRE.toSpeech(test1));
          console.log(SRE.toSpeech(test2));
          console.log(SRE.toSpeech(test3));
          res(x);
        } else if (count < 30) {
          count++;
          setTimeout(checkSRE, 200);
        } else {
          rej(x);
        }
      }
      checkSRE();
    });
  };
  // Edge takes too long to render. So a little timeout!
  let promise = new Promise((res) => {
    setTimeout(() => {res(toSpeechAsync(test1));}, 200);});
  return promise.then((x) => {console.log(x);});
};
