let SRE = require('speech-rule-engine');

let toSpeechAsync = function(x) {
  let count = 0;
  return new Promise((res, rej) => {
    function checkSRE() {
      if (SRE.engineReady()) {
        res(SRE.toSpeech(x));
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


// let p1 = new Promise((res, rej) => {
//      function checkSRE() {
//        if (SRE.engineReady()) {
//          res(SRE.toSpeech(test2));
//        } else {
//          setTimeout(checkSRE, 100);
//        }}
//     checkSRE();
//   });
