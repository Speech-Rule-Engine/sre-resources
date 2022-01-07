let sre = require('speech-rule-engine');
let promise = sre.setupEngine({});

promise.then((e) => console.log(e.length));
promise.then(() => console.log(sre.toSpeech('<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mrow><mi>x</mi><mo>=</mo><mfrac><mrow><mo>&#x2212;</mo><mi>b</mi><mo>&#xB1;</mo><msqrt><mrow><msup><mi>b</mi><mn>2</mn></msup><mo>&#x2212;</mo><mn>4</mn><mi>a</mi><mi>c</mi></mrow></msqrt></mrow><mrow><mn>2</mn><mi>a</mi></mrow></mfrac></mrow></math>')))
  .then(() => console.log(sre.toSpeech('<math xmlns="http://www.w3.org/1998/Math/MathML"><mi>&#x1D63C;</mi></math>')))
  .then(() => console.log(sre.toSpeech('<math xmlns="http://www.w3.org/1998/Math/MathML"><mi>&#x1D63C;</mi></math>')))
  .then(() => sre.setupEngine({locale: 'en', domain: 'mathspeak'}))
  .then(() => console.log(sre.toSpeech('<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mrow><mi>x</mi><mo>=</mo><mfrac><mrow><mo>&#x2212;</mo><mi>b</mi><mo>&#xB1;</mo><msqrt><mrow><msup><mi>b</mi><mn>2</mn></msup><mo>&#x2212;</mo><mn>4</mn><mi>a</mi><mi>c</mi></mrow></msqrt></mrow><mrow><mn>2</mn><mi>a</mi></mrow></mfrac></mrow></math>')))
  .then(() => console.log(sre.toSpeech('<math xmlns="http://www.w3.org/1998/Math/MathML"><mi>&#x1D63C;</mi></math>')))
  // .then(() => sre.file.toSpeech('/home/sorge/git/sre/sre-resources/samples/quadratic-line.xml', '/tmp/out-ms-en.txt'))
  .then(() => sre.setupEngine({locale: 'en', domain: 'clearspeak'}))
  .then(() => console.log(sre.toSpeech('<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mrow><mi>x</mi><mo>=</mo><mfrac><mrow><mo>&#x2212;</mo><mi>b</mi><mo>&#xB1;</mo><msqrt><mrow><msup><mi>b</mi><mn>2</mn></msup><mo>&#x2212;</mo><mn>4</mn><mi>a</mi><mi>c</mi></mrow></msqrt></mrow><mrow><mn>2</mn><mi>a</mi></mrow></mfrac></mrow></math>')))
  .then(() => console.log(sre.toSpeech('<math xmlns="http://www.w3.org/1998/Math/MathML"><mi>&#x1D63C;</mi></math>')))
  // .then(() => sre.file.toSpeech('/home/sorge/git/sre/sre-resources/samples/quadratic-line.xml', '/tmp/out-cs-en.txt'))
  .then(() => {
    console.log(15);
    let promise2 = sre.setupEngine({locale: 'fr', domain: 'mathspeak'});
    console.log(16);
    console.log(promise2);
    promise2.then((e) => console.log(e));
    promise2.then(() => {console.log(sre.toSpeech('<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mrow><mi>x</mi><mo>=</mo><mfrac><mrow><mo>&#x2212;</mo><mi>b</mi><mo>&#xB1;</mo><msqrt><mrow><msup><mi>b</mi><mn>2</mn></msup><mo>&#x2212;</mo><mn>4</mn><mi>a</mi><mi>c</mi></mrow></msqrt></mrow><mrow><mn>2</mn><mi>a</mi></mrow></mfrac></mrow></math>'))})
      .catch((e) => console.log(e));
  })
  .catch((e) => console.log(e));
  
  // result.then(() => sre.file.toSpeech('/home/sorge/git/sre/sre-resources/samples/quadratic-line.xml', '/tmp/out.txt'));
  // console.log(sre.toSpeech('<math xmlns="http://www.w3.org/1998/Math/MathML"><mi>&#x1D63C;</mi></math>'));
  // sre.file.toSpeech('/home/sorge/git/sre/sre-resources/samples/quadratic-line.xml', '/tmp/out-ms-fr.txt');
  // await sre.setupEngine({locale: 'fr', domain: 'clearspeak'});
  // console.log(sre.toSpeech('<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mrow><mi>x</mi><mo>=</mo><mfrac><mrow><mo>&#x2212;</mo><mi>b</mi><mo>&#xB1;</mo><msqrt><mrow><msup><mi>b</mi><mn>2</mn></msup><mo>&#x2212;</mo><mn>4</mn><mi>a</mi><mi>c</mi></mrow></msqrt></mrow><mrow><mn>2</mn><mi>a</mi></mrow></mfrac></mrow></math>'));
  // console.log(sre.toSpeech('<math xmlns="http://www.w3.org/1998/Math/MathML"><mi>&#x1D63C;</mi></math>'));
  // sre.file.toSpeech('/home/sorge/git/sre/sre-resources/samples/quadratic-line.xml', '/tmp/out-cs-fr.txt');
  // await sre.setupEngine({locale: 'gg', domain: 'mathspeak'});
  // console.log(sre.toSpeech('<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mrow><mi>x</mi><mo>=</mo><mfrac><mrow><mo>&#x2212;</mo><mi>b</mi><mo>&#xB1;</mo><msqrt><mrow><msup><mi>b</mi><mn>2</mn></msup><mo>&#x2212;</mo><mn>4</mn><mi>a</mi><mi>c</mi></mrow></msqrt></mrow><mrow><mn>2</mn><mi>a</mi></mrow></mfrac></mrow></math>'));
  // console.log(sre.toSpeech('<math xmlns="http://www.w3.org/1998/Math/MathML"><mi>&#x1D63C;</mi></math>'));
  // sre.file.toSpeech('/home/sorge/git/sre/sre-resources/samples/quadratic-line.xml', '/tmp/out-ms-gg.txt');
  // await sre.setupEngine({locale: 'es', domain: 'mathspeak'});
  // console.log(sre.toSpeech('<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mrow><mi>x</mi><mo>=</mo><mfrac><mrow><mo>&#x2212;</mo><mi>b</mi><mo>&#xB1;</mo><msqrt><mrow><msup><mi>b</mi><mn>2</mn></msup><mo>&#x2212;</mo><mn>4</mn><mi>a</mi><mi>c</mi></mrow></msqrt></mrow><mrow><mn>2</mn><mi>a</mi></mrow></mfrac></mrow></math>'));
  // console.log(sre.toSpeech('<math xmlns="http://www.w3.org/1998/Math/MathML"><mi>&#x1D63C;</mi></math>'));
  // sre.file.toSpeech('/home/sorge/git/sre/sre-resources/samples/quadratic-line.xml', '/tmp/out-ms-es.txt');
  // await sre.setupEngine({locale: 'it', domain: 'mathspeak'});
  // console.log(sre.toSpeech('<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mrow><mi>x</mi><mo>=</mo><mfrac><mrow><mo>&#x2212;</mo><mi>b</mi><mo>&#xB1;</mo><msqrt><mrow><msup><mi>b</mi><mn>2</mn></msup><mo>&#x2212;</mo><mn>4</mn><mi>a</mi><mi>c</mi></mrow></msqrt></mrow><mrow><mn>2</mn><mi>a</mi></mrow></mfrac></mrow></math>'));
  // console.log(sre.toSpeech('<math xmlns="http://www.w3.org/1998/Math/MathML"><mi>&#x1D63C;</mi></math>'));
  // sre.file.toSpeech('/home/sorge/git/sre/sre-resources/samples/quadratic-line.xml', '/tmp/out-ms-it.txt');
  // await sre.setupEngine({locale: 'it', domain: 'clearspeak'});
  // console.log(sre.toSpeech('<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mrow><mi>x</mi><mo>=</mo><mfrac><mrow><mo>&#x2212;</mo><mi>b</mi><mo>&#xB1;</mo><msqrt><mrow><msup><mi>b</mi><mn>2</mn></msup><mo>&#x2212;</mo><mn>4</mn><mi>a</mi><mi>c</mi></mrow></msqrt></mrow><mrow><mn>2</mn><mi>a</mi></mrow></mfrac></mrow></math>'));
  // console.log(sre.toSpeech('<math xmlns="http://www.w3.org/1998/Math/MathML"><mi>&#x1D63C;</mi></math>'));
  // sre.file.toSpeech('/home/sorge/git/sre/sre-resources/samples/quadratic-line.xml', '/tmp/out-cs-it.txt');
  // await sre.setupEngine({locale: 'de', domain: 'mathspeak'});
  // console.log(sre.toSpeech('<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mrow><mi>x</mi><mo>=</mo><mfrac><mrow><mo>&#x2212;</mo><mi>b</mi><mo>&#xB1;</mo><msqrt><mrow><msup><mi>b</mi><mn>2</mn></msup><mo>&#x2212;</mo><mn>4</mn><mi>a</mi><mi>c</mi></mrow></msqrt></mrow><mrow><mn>2</mn><mi>a</mi></mrow></mfrac></mrow></math>'));
  // console.log(sre.toSpeech('<math xmlns="http://www.w3.org/1998/Math/MathML"><mi>&#x1D63C;</mi></math>'));
  // sre.file.toSpeech('/home/sorge/git/sre/sre-resources/samples/quadratic-line.xml', '/tmp/out-ms-de.txt');
  // await sre.setupEngine({locale: 'de', domain: 'clearspeak'});
  // console.log(sre.toSpeech('<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mrow><mi>x</mi><mo>=</mo><mfrac><mrow><mo>&#x2212;</mo><mi>b</mi><mo>&#xB1;</mo><msqrt><mrow><msup><mi>b</mi><mn>2</mn></msup><mo>&#x2212;</mo><mn>4</mn><mi>a</mi><mi>c</mi></mrow></msqrt></mrow><mrow><mn>2</mn><mi>a</mi></mrow></mfrac></mrow></math>'));
  // console.log(sre.toSpeech('<math xmlns="http://www.w3.org/1998/Math/MathML"><mi>&#x1D63C;</mi></math>'));
  // sre.file.toSpeech('/home/sorge/git/sre/sre-resources/samples/quadratic-line.xml', '/tmp/out-cs-de.txt');
  // await sre.setupEngine({locale: 'hi', domain: 'mathspeak'});
  // console.log(sre.toSpeech('<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mrow><mi>x</mi><mo>=</mo><mfrac><mrow><mo>&#x2212;</mo><mi>b</mi><mo>&#xB1;</mo><msqrt><mrow><msup><mi>b</mi><mn>2</mn></msup><mo>&#x2212;</mo><mn>4</mn><mi>a</mi><mi>c</mi></mrow></msqrt></mrow><mrow><mn>2</mn><mi>a</mi></mrow></mfrac></mrow></math>'));
  // console.log(sre.toSpeech('<math xmlns="http://www.w3.org/1998/Math/MathML"><mi>&#x1D63C;</mi></math>'));
  // sre.file.toSpeech('/home/sorge/git/sre/sre-resources/samples/quadratic-line.xml', '/tmp/out-ms-hi.txt');
  // await sre.setupEngine({locale: 'hi', domain: 'clearspeak'});
  // console.log(sre.toSpeech('<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mrow><mi>x</mi><mo>=</mo><mfrac><mrow><mo>&#x2212;</mo><mi>b</mi><mo>&#xB1;</mo><msqrt><mrow><msup><mi>b</mi><mn>2</mn></msup><mo>&#x2212;</mo><mn>4</mn><mi>a</mi><mi>c</mi></mrow></msqrt></mrow><mrow><mn>2</mn><mi>a</mi></mrow></mfrac></mrow></math>'));
  // console.log(sre.toSpeech('<math xmlns="http://www.w3.org/1998/Math/MathML"><mi>&#x1D63C;</mi></math>'));
  // sre.file.toSpeech('/home/sorge/git/sre/sre-resources/samples/quadratic-line.xml', '/tmp/out-cs-hi.txt');
  // await sre.setupEngine({locale: 'nemeth', domain: 'default', modality: 'braille'});
  // console.log(sre.toSpeech('<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mrow><mi>x</mi><mo>=</mo><mfrac><mrow><mo>&#x2212;</mo><mi>b</mi><mo>&#xB1;</mo><msqrt><mrow><msup><mi>b</mi><mn>2</mn></msup><mo>&#x2212;</mo><mn>4</mn><mi>a</mi><mi>c</mi></mrow></msqrt></mrow><mrow><mn>2</mn><mi>a</mi></mrow></mfrac></mrow></math>'));
  // console.log(sre.toSpeech('<math xmlns="http://www.w3.org/1998/Math/MathML"><mi>&#x1D63C;</mi></math>'));
  // sre.file.toSpeech('/home/sorge/git/sre/sre-resources/samples/quadratic-line.xml', '/tmp/out-nemeth.txt');
  // console.log(sre.engineReady());


// (async () => {
//   await tests();
//   // sre.exit();
// })();

