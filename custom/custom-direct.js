const fs = require('fs');
global.SREfeature = {
  custom: loc => {
    console.log(`Loading locale ${loc}`);
    let file = `/tmp/mymaps/${loc}.json`;
    return new Promise((res, rej) => {
      try {
        res(fs.readFileSync(file));
        console.log(`Loading of locale ${loc} succeeded`);
      } catch (_) {
        console.log(`Loading of locale ${loc} failed`);
        rej('');
      }
    });
  }
};
let sre = require(process.cwd() + '/node_modules/speech-rule-engine/lib/sre.js');
let promise = sre.engineReady();
console.log(6);
console.log(promise);
promise.then(() => console.log(sre.toSpeech('<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mrow><mi>x</mi><mo>=</mo><mfrac><mrow><mo>&#x2212;</mo><mi>b</mi><mo>&#xB1;</mo><msqrt><mrow><msup><mi>b</mi><mn>2</mn></msup><mo>&#x2212;</mo><mn>4</mn><mi>a</mi><mi>c</mi></mrow></msqrt></mrow><mrow><mn>2</mn><mi>a</mi></mrow></mfrac></mrow></math>')));
sre.setupEngine({domain: 'clearspeak'}).then(() => console.log(sre.toSpeech('<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mrow><mi>x</mi><mo>=</mo><mfrac><mrow><mo>&#x2212;</mo><mi>b</mi><mo>&#xB1;</mo><msqrt><mrow><msup><mi>b</mi><mn>2</mn></msup><mo>&#x2212;</mo><mn>4</mn><mi>a</mi><mi>c</mi></mrow></msqrt></mrow><mrow><mn>2</mn><mi>a</mi></mrow></mfrac></mrow></math>')));
