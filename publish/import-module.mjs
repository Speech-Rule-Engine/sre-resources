import './node_modules/speech-rule-engine/lib/require.mjs';


import { SystemExternal } from './node_modules/speech-rule-engine/js/common/system_external.js';
console.log(SystemExternal);
console.log(SystemExternal.fs);
console.log(SystemExternal.documentSupported);
console.log(SystemExternal.extRequire);
console.log(SystemExternal.extRequire('fs'));



import * as Semantic from './node_modules/speech-rule-engine/js/semantic_tree/semantic.js';

console.log(Semantic);
let quadratic = Semantic.getTreeFromString('<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mrow><mi>x</mi><mo>=</mo><mfrac><mrow><mo>&#x2212;</mo><mi>b</mi><mo>&#xB1;</mo><msqrt><mrow><msup><mi>b</mi><mn>2</mn></msup><mo>&#x2212;</mo><mn>4</mn><mi>a</mi><mi>c</mi></mrow></msqrt></mrow><mrow><mn>2</mn><mi>a</mi></mrow></mfrac></mrow></math>');
console.log(quadratic.toString());

import * as System from  './node_modules/speech-rule-engine/js/common/system.js';
console.log(process.env['SRE_JSON_PATH']);
process.env['SRE_JSON_PATH'] = '/home/sorge/git/sre/speech-rule-engine/lib/mathmaps';
console.log(process.env['SRE_JSON_PATH']);
console.log(System.setupEngine({json: '/home/sorge/git/sre/speech-rule-engine/lib/mathmaps', locale: 'en', delay: true}));
System.setupEngine({locale: 'en'}).then(() => {
  console.log(System);
  console.log(System.toSpeech('<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mrow><mi>x</mi><mo>=</mo><mfrac><mrow><mo>&#x2212;</mo><mi>b</mi><mo>&#xB1;</mo><msqrt><mrow><msup><mi>b</mi><mn>2</mn></msup><mo>&#x2212;</mo><mn>4</mn><mi>a</mi><mi>c</mi></mrow></msqrt></mrow><mrow><mn>2</mn><mi>a</mi></mrow></mfrac></mrow></math>'));
});

