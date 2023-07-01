let sre = require('speech-rule-engine');

let runSpeechTests = async function(locale) {
  return sre.setupEngine({locale: locale, domain: 'mathspeak', modality: 'speech'})
    .then(() => console.log(sre.toSpeech('<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mrow><mi>x</mi><mo>=</mo><mfrac><mrow><mo>&#x2212;</mo><mi>b</mi><mo>&#xB1;</mo><msqrt><mrow><msup><mi>b</mi><mn>2</mn></msup><mo>&#x2212;</mo><mn>4</mn><mi>a</mi><mi>c</mi></mrow></msqrt></mrow><mrow><mn>2</mn><mi>a</mi></mrow></mfrac></mrow></math>')))
    .then(() => console.log(sre.toSpeech('<math xmlns="http://www.w3.org/1998/Math/MathML"><mi>&#x1D63C;</mi></math>')))
    .then(() => sre.file.toSpeech('/home/sorge/git/sre/sre-resources/samples/quadratic-line.xml'))
    .then(() => sre.file.toSpeech('/home/sorge/git/sre/sre-resources/samples/quadratic-line.xml', `/tmp/out-ms-${locale}.txt`))
    .then(() => sre.setupEngine({locale: locale, domain: 'clearspeak', modality: 'speech'}))
    .then(() => console.log(sre.toSpeech('<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mrow><mi>x</mi><mo>=</mo><mfrac><mrow><mo>&#x2212;</mo><mi>b</mi><mo>&#xB1;</mo><msqrt><mrow><msup><mi>b</mi><mn>2</mn></msup><mo>&#x2212;</mo><mn>4</mn><mi>a</mi><mi>c</mi></mrow></msqrt></mrow><mrow><mn>2</mn><mi>a</mi></mrow></mfrac></mrow></math>')))
    .then(() => console.log(sre.toSpeech('<math xmlns="http://www.w3.org/1998/Math/MathML"><mi>&#x1D63C;</mi></math>')))
    .then(() => sre.file.toSpeech('/home/sorge/git/sre/sre-resources/samples/quadratic-line.xml'))
    .then(() => sre.file.toSpeech('/home/sorge/git/sre/sre-resources/samples/quadratic-line.xml', `/tmp/out-cs-${locale}.txt`));
};


let runBrailleTests = async function(locale) {
  return sre.setupEngine({locale: locale, domain: 'default', modality: 'braille'})
    .then(() => console.log(sre.toSpeech('<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mrow><mi>x</mi><mo>=</mo><mfrac><mrow><mo>&#x2212;</mo><mi>b</mi><mo>&#xB1;</mo><msqrt><mrow><msup><mi>b</mi><mn>2</mn></msup><mo>&#x2212;</mo><mn>4</mn><mi>a</mi><mi>c</mi></mrow></msqrt></mrow><mrow><mn>2</mn><mi>a</mi></mrow></mfrac></mrow></math>')))
    .then(() => console.log(sre.toSpeech('<math xmlns="http://www.w3.org/1998/Math/MathML"><mi>&#x1D63C;</mi></math>')))
    .then(() => sre.file.toSpeech('/home/sorge/git/sre/sre-resources/samples/quadratic-line.xml'))
    .then(() => sre.file.toSpeech('/home/sorge/git/sre/sre-resources/samples/quadratic-line.xml', `/tmp/out-def-${locale}.txt`));
};

let runAllTests = async function() {
  for (let locale of sre.variables.LOCALES.keys()) {
    if (locale === 'nemeth' || locale === 'euro') {
      await runBrailleTests(locale);
      continue;
    }
    await runSpeechTests(locale);
  }
};

runAllTests();
