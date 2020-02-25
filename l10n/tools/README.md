# L10N Workflow

## Symbol extraction workflow


``` javascript
    require('/home/sorge/sre/sre-resources/l10n/tools/split-json.js');
```

``` javascript
SplitJson.completeLocale(locale);
```

Grep embellished characters in unicode-table-data. Full grep:

``` bash
echo "sre.AlphabetGenerator.Embellish.SUPER" > /tmp/embellished
grep '2070' loc/$LOCALE/symbols/* >> /tmp/embellished
echo "sre.AlphabetGenerator.Embellish.SUB" >> /tmp/embellished
grep '2080' loc/$LOCALE/symbols/* >> /tmp/embellished
echo "sre.AlphabetGenerator.Embellish.CIRCLED" >> /tmp/embellished
grep '24EA' loc/$LOCALE/symbols/* >> /tmp/embellished
echo "sre.AlphabetGenerator.Embellish.CIRCLED" >> /tmp/embellished
grep '3251' loc/$LOCALE/symbols/* >> /tmp/embellished
echo "sre.AlphabetGenerator.Embellish.CIRCLED" >> /tmp/embellished
grep '32B1' loc/$LOCALE/symbols/* >> /tmp/embellished
echo "sre.AlphabetGenerator.Embellish.PARENTHESIZED" >> /tmp/embellished
grep '2474' loc/$LOCALE/symbols/* >> /tmp/embellished
echo "sre.AlphabetGenerator.Embellish.PERIOD" >> /tmp/embellished
grep '2488' loc/$LOCALE/symbols/* >> /tmp/embellished
echo "sre.AlphabetGenerator.Embellish.NEGATIVECIRCLED" >> /tmp/embellished
grep '2775' loc/$LOCALE/symbols/* >> /tmp/embellished
echo "sre.AlphabetGenerator.Embellish.NEGATIVECIRCLED" >> /tmp/embellished
grep '24EB' loc/$LOCALE/symbols/* >> /tmp/embellished
echo "sre.AlphabetGenerator.Embellish.DOUBLECIRCLED" >> /tmp/embellished
grep '24F5' loc/$LOCALE/symbols/* >> /tmp/embellished
echo "sre.AlphabetGenerator.Embellish.CIRCLEDSANSSERIF" >> /tmp/embellished
grep '277F' loc/$LOCALE/symbols/* >> /tmp/embellished
echo "sre.AlphabetGenerator.Embellish.NEGATIVECIRCLEDSANSSERIF" >> /tmp/embellished
grep '278A' loc/$LOCALE/symbols/* >> /tmp/embellished
echo "sre.AlphabetGenerator.Embellish.COMMA" >> /tmp/embellished
grep '1F101' loc/$LOCALE/symbols/* >> /tmp/embellished
echo "sre.AlphabetGenerator.Embellish.CIRCLED" >> /tmp/embellished
grep '24B6' loc/$LOCALE/symbols/* >> /tmp/embellished
echo "sre.AlphabetGenerator.Embellish.CIRCLED" >> /tmp/embellished
grep '24D0' loc/$LOCALE/symbols/* >> /tmp/embellished
echo "sre.AlphabetGenerator.Embellish.PARENTHESIZED" >> /tmp/embellished
grep '1F110' loc/$LOCALE/symbols/plane1/* >> /tmp/embellished
echo "sre.AlphabetGenerator.Embellish.PARENTHESIZED" >> /tmp/embellished
grep '249C' loc/$LOCALE/symbols/* >> /tmp/embellished
echo "sre.AlphabetGenerator.Embellish.SQUARED" >> /tmp/embellished
grep '1F130' loc/$LOCALE/symbols/plane1/* >> /tmp/embellished
echo "sre.AlphabetGenerator.Embellish.NEGATIVESQUARED" >> /tmp/embellished
grep '1F170' loc/$LOCALE/symbols/plane1/* >> /tmp/embellished
echo "sre.AlphabetGenerator.Embellish.NEGATIVECIRCLED" >> /tmp/embellished
grep '1F150' loc/$LOCALE/symbols/plane1/* >> /tmp/embellished
```

Minimal grep:

``` bash
echo "sre.AlphabetGenerator.Embellish.SUPER" > /tmp/embellished
grep '2070' loc/$LOCALE/symbols/* >> /tmp/embellished
echo "sre.AlphabetGenerator.Embellish.SUB" >> /tmp/embellished
grep '2080' loc/$LOCALE/symbols/* >> /tmp/embellished
echo "sre.AlphabetGenerator.Embellish.CIRCLED" >> /tmp/embellished
grep '24EA' loc/$LOCALE/symbols/* >> /tmp/embellished
echo "sre.AlphabetGenerator.Embellish.PARENTHESIZED" >> /tmp/embellished
grep '2474' loc/$LOCALE/symbols/* >> /tmp/embellished
echo "sre.AlphabetGenerator.Embellish.PERIOD" >> /tmp/embellished
grep '2488' loc/$LOCALE/symbols/* >> /tmp/embellished
echo "sre.AlphabetGenerator.Embellish.NEGATIVECIRCLED" >> /tmp/embellished
grep '2775' loc/$LOCALE/symbols/* >> /tmp/embellished
echo "sre.AlphabetGenerator.Embellish.DOUBLECIRCLED" >> /tmp/embellished
grep '24F5' loc/$LOCALE/symbols/* >> /tmp/embellished
echo "sre.AlphabetGenerator.Embellish.CIRCLEDSANSSERIF" >> /tmp/embellished
grep '277F' loc/$LOCALE/symbols/* >> /tmp/embellished
echo "sre.AlphabetGenerator.Embellish.NEGATIVECIRCLEDSANSSERIF" >> /tmp/embellished
grep '278A' loc/$LOCALE/symbols/* >> /tmp/embellished
echo "sre.AlphabetGenerator.Embellish.COMMA" >> /tmp/embellished
grep '1F101' loc/$LOCALE/symbols/plane1/* >> /tmp/embellished
echo "sre.AlphabetGenerator.Embellish.SQUARED" >> /tmp/embellished
grep '1F130' loc/$LOCALE/symbols/plane1/* >> /tmp/embellished
echo "sre.AlphabetGenerator.Embellish.NEGATIVESQUARED" >> /tmp/embellished
grep '1F170' loc/$LOCALE/symbols/plane1/* >> /tmp/embellished
```
