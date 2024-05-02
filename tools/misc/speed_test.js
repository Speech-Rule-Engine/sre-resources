mathspeakExpr = function() {
  var mml = '<mrow><mtable columnalign="left"><mtr><mtd columnalign="left">' +
      '<mrow /></mtd><mtd columnalign="left"><mrow /></mtd><mtd' +
      ' columnalign="left"><mrow><mo stretchy="false">(</mo><mi' +
      ' mathvariant="normal">A</mi><mo mathvariant="normal">.</mo><mn>1' +
      '</mn><mo stretchy="false">)</mo><mspace width="0.2em" /><mi' +
      ' mathvariant="normal">If</mi><mspace width="0.2em" /><mi>A</mi>' +
      '<mo>&#x2208;</mo><mrow><mi>&#x2131;</mi></mrow><mspace' +
      ' width="0.2em" /><mi mathvariant="normal">then</mi><mspace' +
      ' width="0.2em" /><mn>0</mn><mo>&#x2264;</mo><mi>P</mi><mo' +
      ' stretchy="false">{</mo><mi>A</mi><mo stretchy="false">}</mo>' +
      '<mo>&#x2264;</mo><mn>1</mn><mo>.</mo></mrow></mtd><mtd' +
      ' columnalign="left"><mo stretchy="false">(</mo><mn>1</mn><mo' +
      ' stretchy="false">)</mo></mtd></mtr><mtr><mtd columnalign="right"' +
      ' columnspan="1"><mrow /></mtd><mtd columnalign="left"><mrow />' +
      '</mtd><mtd columnalign="left"><mrow><mo stretchy="false">(</mo><mi' +
      ' mathvariant="normal">A</mi><mo mathvariant="normal">.</mo><mn>2' +
      '</mn><mo stretchy="false">)</mo><mspace width="0.2em" /><mi>P</mi>' +
      '<mo stretchy="false">{</mo><mrow><mi>&#x1D4AE;</mi></mrow><mo' +
      ' stretchy="false">}</mo><mo>=</mo><mn>1</mn><mo>.</mo></mrow>' +
      '</mtd><mtd columnalign="left"><mo stretchy="false">(</mo><mn>2' +
      '</mn><mo stretchy="false">)</mo></mtd></mtr><mtr><mtd' +
      ' columnalign="right" columnspan="1"><mrow /></mtd><mtd' +
      ' columnalign="left"><mrow /></mtd><mtd columnalign="left"><mrow>' +
      '<mo stretchy="false">(</mo><mi mathvariant="normal">A</mi><mo' +
      ' mathvariant="normal">.</mo><mn>3</mn><mo stretchy="false">)</mo>' +
      '<mspace width="0.2em" /><mi mathvariant="normal">If</mi><mspace' +
      ' width="0.2em" /><mo stretchy="false">{</mo><msub><mi>E</mi><mrow>' +
      '<mi>n</mi></mrow></msub><mo>,</mo><mi>n</mi><mo>&#x2265;</mo><mn>1' +
      '</mn><mo stretchy="false">}</mo><mo>&#x2208;</mo><mrow>' +
      '<mi>&#x2131;</mi></mrow><mspace width="0.2em" /><mtext>is a' +
      ' sequence of</mtext><mspace width="0.2em" /><mtext>disjoint' +
      '</mtext></mrow></mtd><mtd columnalign="left"><mo' +
      ' stretchy="false">(</mo><mn>3</mn><mo stretchy="false">)</mo>' +
      '</mtd></mtr></mtable></mrow>';
  var answer = 'StartLayout 1st Row 1st Column Blank 2nd' +
      ' Column Blank 3rd Column left-parenthesis normal' +
      ' upper A period 1 right-parenthesis upper I f upper' +
      ' A element-of script upper F t h e n 0' +
      ' less-than-or-equal-to upper P left-brace upper A' +
      ' right-brace less-than-or-equal-to 1 period 4th' +
      ' Column left-parenthesis 1 right-parenthesis 2nd' +
      ' Row 1st Column Blank 2nd Column Blank 3rd Column' +
      ' left-parenthesis normal upper A period 2' +
      ' right-parenthesis upper P left-brace script upper' +
      ' S right-brace equals 1 period 4th Column' +
      ' left-parenthesis 2 right-parenthesis 3rd Row 1st' +
      ' Column Blank 2nd Column Blank 3rd Column' +
      ' left-parenthesis normal upper A period 3' +
      ' right-parenthesis upper I f left-brace upper E' +
      ' Subscript n Baseline comma n' +
      ' greater-than-or-equal-to 1 right-brace element-of' +
      ' script upper F is a sequence of disjoint 4th' +
      ' Column left-parenthesis 3 right-parenthesis' +
      ' EndLayout';
  var mathMl = '<math xmlns="http://www.w3.org/1998/Math/MathML">' +
          mml + '</math>';
  sre.SpeechRuleEngine.getInstance().clearCache();
  var result = sre.System.getInstance().toSpeech(mathMl);
  return assert.equal(result, answer);
};


speedTest = function(times) {
  var count = times;
  var timeIn = (new Date()).getTime();
  sre.System.getInstance().setupEngine(
      {semantics: true, domain: 'mathspeak', style: 'default',
       rules: sre.Engine.getInstance().ruleSets});
  while (count) {
    mathspeakExpr();
    count--;
  }
  var timeOut = (new Date()).getTime();
  console.log('Time for tests: ' + (timeOut - timeIn) + 'ms\n');
  console.log('Average Time: ' + ((timeOut - timeIn) / times) + 'ms\n');
};

