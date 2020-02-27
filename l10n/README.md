## Directories and Structure



## Helper Files for L10n

Create both online forms and spreadsheets for

* Symbols. 3 columns: symbol, English, Locale (form JSON)
* Units. 6 columns: key, names, English, Locale: singular, plural, dual/special (from JSON)
  Separate spreadsheet for prefixes?
* Functions. 4 columns: key, names, English, Locale (from JSON)
* Fonts, Roles, Enclose, Navigate, MS. 3 columns: key, English, Locale (from Messages)
* Numbers, Ordinals. 2 columns: English, Locale (from special files)
* Prefixes, Summaries. 2 columns: English, Locale (from rule files)

### Notes

#### JSON files

We can automate the following processes: 

* JSON to HTML: index file with links to the single tables.
* JSON to ODS: single spreadsheets with single sheets per file.
* ODS to JSON: get content.xml and write the JSON output.

#### Messages

We can automate: 

* locale_XX.js to HTML: index file with links to the single tables.
* locale_XX.js to ODS: single spreadsheets with single sheets per message category.
* ODS to locale_XX.js: get content.xml and write the Locale file. Don't forget to
        include Func element! This can be tricky when updating.

#### Numbers

The spreadsheets are just guidelines to give an idea how the procedure should
work. So they just have to be copied to their respective online positions.

Maybe have a function to extract content and make it available as HTML.


#### Rules:

We can automate:

* Extraction of messages, checking for `[t] "mmm"` elements. The `mmm` is then
  the English to be localised.
  
Replacement can't really be automated, as they might differ per locale.


## Tool chain:

#### Javascript functionality

- [ ] Symbols to HTML
- [ ] Units, Functions to HTML


- [ ] Symbols to Spreadsheet
- [ ] Units, Functions to Spreadsheet

- [ ] Load extracted unicode and match


#### Shell scripts

- [ ] Extract unicode 
- [ ] Helper extraction from JSON/Messages/etc. for locale
- [ ] Locale update (inverse)


## Checklist:

#### Create online forms from Json:

- [ ] Symbols 
- [ ] Units
- [ ] Functions

In the form of a 


#### Create spreadsheets from Json:

- [ ] Symbols
- [ ] Units
- [ ] Functions

In the form of a 


#### Templates:

- [ ] Empty Spreadsheet (without content.xml) for generation of JSON
- [ ] Numbers Spreadsheet
- [ ] Rules Spreadsheet


# L10N Workflow

## Symbol extraction workflow

* Extract MathPlayer files
* Clean them up
* Copy them to `speech-rule-engine` directory
* Complete them with unicode mappings
* Check and copy them to `speech-rule-engine` directory again.
* Make sure to keep the unused files as they contain some hints on how to
  transform alphabets and fonts


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

## Transformations

This transform information from other systems/repositories to create unicode mappings.

Structure of the `transform` directory:
  * `pre-forms` contains everything harvested from MathPlayer mappings
  * `int-forms` contains cleaned up versions of `pre-forms`. E.g., with the English parts removed.
  * `split-forms` contains split up versions of the int-forms.
  * __copy the `iso` files not the `iso-new` files__
