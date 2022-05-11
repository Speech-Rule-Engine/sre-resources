let sre = require('speech-rule-engine');
let promise = sre.setupEngine({});

let quadratic = '<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mrow><mi>x</mi><mo>=</mo><mfrac><mrow><mo>&#x2212;</mo><mi>b</mi><mo>&#xB1;</mo><msqrt><mrow><msup><mi>b</mi><mn>2</mn></msup><mo>&#x2212;</mo><mn>4</mn><mi>a</mi><mi>c</mi></mrow></msqrt></mrow><mrow><mn>2</mn><mi>a</mi></mrow></mfrac></mrow></math>';
let simple = '<math xmlns="http://www.w3.org/1998/Math/MathML"><mi>&#x1D63C;</mi></math>';


const runTests = async function(locale, language) {
  console.log(`LOCALE ${language}`);
  await sre.setupEngine({locale: locale, domain: 'clearspeak'});
  console.log(sre.toSpeech(quadratic));
  console.log(sre.toSpeech(simple));
  await sre.setupEngine({locale: locale, domain: 'mathspeak'});
  console.log(sre.toSpeech(quadratic));
  console.log(sre.toSpeech(simple));
};

const allTests = async function() {
  for (let [locale, language] of sre.variables.LOCALES.entries()) {
    if (locale === 'nemeth') continue;
    await runTests(locale, language);
  }
  await runTests('gg', 'GiGi');
  console.log(`LOCALE nemeth`);
  await sre.setupEngine({locale: 'nemeth', domain: 'default', modality: 'braille'});
  console.log(sre.toSpeech(quadratic));
  console.log(sre.toSpeech(simple));
};

console.log('Direct');
promise.then(() => console.log(sre.toSpeech(quadratic)))
  .then(() => console.log(sre.toSpeech(simple)))
  .then(() => sre.setupEngine({locale: 'en', domain: 'mathspeak'}))
  .then(() => console.log(sre.toSpeech(quadratic)))
  .then(() => console.log(sre.toSpeech(simple)))
  .then(() => sre.setupEngine({locale: 'en', domain: 'clearspeak'}))
  .then(() => console.log(sre.toSpeech(quadratic)))
  .then(() => console.log(sre.toSpeech(simple)))
  .then(() => {
    let promise2 = sre.setupEngine({locale: 'fr', domain: 'mathspeak'});
    promise2.then((e) => console.log(e));
    promise2.then(() => console.log(sre.toSpeech(quadratic)))
      .catch((e) => console.log(e));
    return promise2;
  })
  .then(() => sre.setupEngine({locale: 'it', domain: 'mathspeak'}))
  .then(() => console.log(sre.toSpeech(quadratic)))
  .then(() => allTests())
  .catch((e) => console.log(e));
  
