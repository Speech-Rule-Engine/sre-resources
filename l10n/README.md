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

* We can do this wrt. the original English rule set.

## Tool chain:

#### Javascript functionality

- [ ] Symbols to HTML
- [ ] Units, Functions to HTML


- [ ] Symbols to Spreadsheet
- [ ] Units, Functions to Spreadsheet

- [ ] Load extracted unicode and match


#### Shell scripts

- [x] Extract unicode
- [x] Helper extraction from JSON/Messages/etc. for locale
- [ ] Locale update (inverse)


## Checklist:

#### Create online forms from Json:

- [x] Symbols
- [x] Units
- [x] Functions

In the form of a


#### Create spreadsheets from Json:

- [x] Symbols
- [x] Units
- [x] Functions

In the form of a


#### Templates:

- [x] Empty Spreadsheet (without content.xml) for generation of JSON
- [x] AlphaNum Spreadsheet: Alphabets and numerals
- [x] Messages: Prefix, summaries, roles, mathspeak, clearspeak, etc.
- [ ] Rules Spreadsheet


# L10N Workflow

## Symbol extraction workflow

* Extract MathPlayer files
  ``` bash
  ./extract.sh ../../../others/MathPlayer/Rules/ /tmp
  ```
* Clean them up (if necesary)
* Extractions are already available in the `transform` subdirectory.

## Transformations and initial MathMaps

This transforms information from other systems/repositories to create unicode mappings.

Structure of the `transform` directory:
  * `pre-forms` contains everything harvested from MathPlayer mappings
  * `int-forms` contains cleaned up versions of `pre-forms`. E.g., with the English parts removed.
  * `split-forms` contains split up versions of the int-forms. These are generated with

``` javascript
    require('/home/sorge/git/sre/sre-resources/l10n/tools/split-json.js');
    SplitJson.allFiles(locale);
```

* Copy the `iso` directory from `split-forms` to `speech-rule-engine` mathmaps directory
* __copy the `iso` files not the `iso-new` files__

## Completing symbol maps

* Copy the `locale` subdirectory from `split-forms` to the mathmaps directory.
* Complete them with unicode mappings, which are assumed to be in
  `git/sre/others/unicode-table-data/`.
* Complete the symbols mappings with

``` javascript
SplitJson.completeLocale(locale);
```
  This assumes the locale mappings already in the mathmaps directory! It writes the completed
  mappings to the `split-forms` directory again.
* Check and copy them to `speech-rule-engine` directory again.


### Finalising symbol mappings

* Make sure to keep the unused files as they contain some hints on how to
  transform alphabets, fonts and number sets.
* Also manually correct symbols `0x0394` in `greek-rest.js` for clearspeak
  triangle.
* Likewise add clearspeak entries for `0x00B2` and `0x00B3` in `digits_rest.js`.

### Finalising unit/function mappings

* Try completing the `locale-missing.csv` entries.
* For those elements exist empty entries in the respective `units` and `functions` files.
* Copy these to the respective entries in the files in the units and functions subdirectories.
* Correct celsius and fahrenheit in `temperature.js` manually.
* Fill in as much as possible manually.
* `ln` entry for clearspeak.


## Starting a Locale from Scratch

``` javascript
    require('/home/sorge/git/sre/sre-resources/tools/l10n/split-json.js');
    SplitJson.generateFiles(locale);
```

This will automatically call the `allFiles` method and results will be in
`split-forms` folder.

At this point we have the following content:

* `functions`: Files will be filled with complete but empty entries.
* `si`: A file with an empty list. Those need to be added by hand.
* `symbols`: All files with empty mappings.
* `units`: Files will be filled with complete but empty entries.

### Completing symbol maps

Follow the steps from above.

### Completing with CLDR

Copy the latest files into the mathmaps directory and then simply run

```
SplitJson.completeCldrLocale(iso);
```

Note that this fills the files in the mathmaps directory in-place.

## Alphabet generation

* Hints at how capital letters, fonts etc. are called might be in `local-rest/symbols.js`

### Fonts

Grep fonts for alphabets in `git/sre/others/unicode-table-data/`:

```bash
echo 'normal:' > /tmp/fonts
grep '0041' loc/$LOCALE/symbols/* >> /tmp/fonts
echo 'fullwidth:' >> /tmp/fonts
grep 'FF21' loc/$LOCALE/symbols/* >> /tmp/fonts
echo 'bold:' >> /tmp/fonts
grep '1D400' loc/$LOCALE/symbols/plane1/* >> /tmp/fonts
echo 'italic:' >> /tmp/fonts
grep '1D434' loc/$LOCALE/symbols/plane1/* >> /tmp/fonts
echo 'bold-italic:' >> /tmp/fonts
grep '1D468' loc/$LOCALE/symbols/plane1/* >> /tmp/fonts
echo 'script:' >> /tmp/fonts
grep '1D49C' loc/$LOCALE/symbols/plane1/* >> /tmp/fonts
echo 'bold-script:' >> /tmp/fonts
grep '1D4D0' loc/$LOCALE/symbols/plane1/* >> /tmp/fonts
echo 'fraktur:' >> /tmp/fonts
grep '1D504' loc/$LOCALE/symbols/plane1/* >> /tmp/fonts
echo 'double-struck:' >> /tmp/fonts
grep '1D538' loc/$LOCALE/symbols/plane1/* >> /tmp/fonts
echo 'bold-fraktur:' >> /tmp/fonts
grep '1D56C' loc/$LOCALE/symbols/plane1/* >> /tmp/fonts
echo 'sans-serif:' >> /tmp/fonts
grep '1D5A0' loc/$LOCALE/symbols/plane1/* >> /tmp/fonts
echo 'sans-serif-italic:' >> /tmp/fonts
grep '1D5D4' loc/$LOCALE/symbols/plane1/* >> /tmp/fonts
echo 'sans-serif-bold:' >> /tmp/fonts
grep '1D608' loc/$LOCALE/symbols/plane1/* >> /tmp/fonts
echo 'sans-serif-bold-italic:' >> /tmp/fonts
grep '1D63C' loc/$LOCALE/symbols/plane1/* >> /tmp/fonts
echo 'monospace:' >> /tmp/fonts
grep '1D670' loc/$LOCALE/symbols/plane1/* >> /tmp/fonts
```


### Embellished characters

Grep embellished characters in unicode-table-data. Minimal grep:

``` bash
echo "super" > /tmp/embellished
grep '2070' loc/$LOCALE/symbols/* >> /tmp/embellished
echo "sub" >> /tmp/embellished
grep '2080' loc/$LOCALE/symbols/* >> /tmp/embellished
echo "circled" >> /tmp/embellished
grep '24EA' loc/$LOCALE/symbols/* >> /tmp/embellished
echo "parenthesized" >> /tmp/embellished
grep '2474' loc/$LOCALE/symbols/* >> /tmp/embellished
echo "period" >> /tmp/embellished
grep '2488' loc/$LOCALE/symbols/* >> /tmp/embellished
echo "negative-circled" >> /tmp/embellished
grep '24EB' loc/$LOCALE/symbols/* >> /tmp/embellished
echo "double-circled" >> /tmp/embellished
grep '24F5' loc/$LOCALE/symbols/* >> /tmp/embellished
echo "circled-sans-serif" >> /tmp/embellished
grep '277F' loc/$LOCALE/symbols/* >> /tmp/embellished
echo "negative-circled-sans-serif" >> /tmp/embellished
grep '278A' loc/$LOCALE/symbols/* >> /tmp/embellished
echo "comma" >> /tmp/embellished
grep '1F101' loc/$LOCALE/symbols/plane1/* >> /tmp/embellished
echo "squared" >> /tmp/embellished
grep '1F130' loc/$LOCALE/symbols/plane1/* >> /tmp/embellished
echo "negative-squared" >> /tmp/embellished
grep '1F170' loc/$LOCALE/symbols/plane1/* >> /tmp/embellished
```

Full grep in case elements are missing or not translated:

``` bash
echo "super:" > /tmp/embellished
grep '2070' loc/$LOCALE/symbols/* >> /tmp/embellished
echo "sub:" >> /tmp/embellished
grep '2080' loc/$LOCALE/symbols/* >> /tmp/embellished
echo "circled:" >> /tmp/embellished
grep '24EA' loc/$LOCALE/symbols/* >> /tmp/embellished
echo "circled:" >> /tmp/embellished
grep '3251' loc/$LOCALE/symbols/* >> /tmp/embellished
echo "circled:" >> /tmp/embellished
grep '32B1' loc/$LOCALE/symbols/* >> /tmp/embellished
echo "parenthesized:" >> /tmp/embellished
grep '2474' loc/$LOCALE/symbols/* >> /tmp/embellished
echo "period:" >> /tmp/embellished
grep '2488' loc/$LOCALE/symbols/* >> /tmp/embellished
echo "negative-circled:" >> /tmp/embellished
grep '2775' loc/$LOCALE/symbols/* >> /tmp/embellished
echo "negative-circled:" >> /tmp/embellished
grep '24EB' loc/$LOCALE/symbols/* >> /tmp/embellished
echo "double-circled:" >> /tmp/embellished
grep '24F5' loc/$LOCALE/symbols/* >> /tmp/embellished
echo "circled-sans-serif:" >> /tmp/embellished
grep '277F' loc/$LOCALE/symbols/* >> /tmp/embellished
echo "negative-circled-sans-serif:" >> /tmp/embellished
grep '278A' loc/$LOCALE/symbols/* >> /tmp/embellished
echo "comma:" >> /tmp/embellished
grep '1F101' loc/$LOCALE/symbols/* >> /tmp/embellished
echo "circled:" >> /tmp/embellished
grep '24B6' loc/$LOCALE/symbols/* >> /tmp/embellished
echo "circled:" >> /tmp/embellished
grep '24D0' loc/$LOCALE/symbols/* >> /tmp/embellished
echo "parenthesized:" >> /tmp/embellished
grep '1F110' loc/$LOCALE/symbols/plane1/* >> /tmp/embellished
echo "parenthesized:" >> /tmp/embellished
grep '249C' loc/$LOCALE/symbols/* >> /tmp/embellished
echo "squared:" >> /tmp/embellished
grep '1F130' loc/$LOCALE/symbols/plane1/* >> /tmp/embellished
echo "negative-squared:" >> /tmp/embellished
grep '1F170' loc/$LOCALE/symbols/plane1/* >> /tmp/embellished
echo "negative-circled:" >> /tmp/embellished
grep '1F150' loc/$LOCALE/symbols/plane1/* >> /tmp/embellished
```


### Alphabets

#### Latin Capital

``` bash
    grep '0041' loc/$LOCALE/symbols/* > /tmp/latin-capital
    grep '0042' loc/$LOCALE/symbols/* >> /tmp/latin-capital
    grep '0043' loc/$LOCALE/symbols/* >> /tmp/latin-capital
    grep '0044' loc/$LOCALE/symbols/* >> /tmp/latin-capital
    grep '0045' loc/$LOCALE/symbols/* >> /tmp/latin-capital
    grep '0046' loc/$LOCALE/symbols/* >> /tmp/latin-capital
    grep '0047' loc/$LOCALE/symbols/* >> /tmp/latin-capital
    grep '0048' loc/$LOCALE/symbols/* >> /tmp/latin-capital
    grep '0049' loc/$LOCALE/symbols/* >> /tmp/latin-capital
    grep '004A' loc/$LOCALE/symbols/* >> /tmp/latin-capital
    grep '004B' loc/$LOCALE/symbols/* >> /tmp/latin-capital
    grep '004C' loc/$LOCALE/symbols/* >> /tmp/latin-capital
    grep '004D' loc/$LOCALE/symbols/* >> /tmp/latin-capital
    grep '004E' loc/$LOCALE/symbols/* >> /tmp/latin-capital
    grep '004F' loc/$LOCALE/symbols/* >> /tmp/latin-capital
    grep '0050' loc/$LOCALE/symbols/* >> /tmp/latin-capital
    grep '0051' loc/$LOCALE/symbols/* >> /tmp/latin-capital
    grep '0052' loc/$LOCALE/symbols/* >> /tmp/latin-capital
    grep '0053' loc/$LOCALE/symbols/* >> /tmp/latin-capital
    grep '0054' loc/$LOCALE/symbols/* >> /tmp/latin-capital
    grep '0055' loc/$LOCALE/symbols/* >> /tmp/latin-capital
    grep '0056' loc/$LOCALE/symbols/* >> /tmp/latin-capital
    grep '0057' loc/$LOCALE/symbols/* >> /tmp/latin-capital
    grep '0058' loc/$LOCALE/symbols/* >> /tmp/latin-capital
    grep '0059' loc/$LOCALE/symbols/* >> /tmp/latin-capital
    grep '005A' loc/$LOCALE/symbols/* >> /tmp/latin-capital
```


#### Latin Small

``` bash
    grep '0061' loc/$LOCALE/symbols/* > /tmp/latin-small
    grep '0062' loc/$LOCALE/symbols/* >> /tmp/latin-small
    grep '0063' loc/$LOCALE/symbols/* >> /tmp/latin-small
    grep '0064' loc/$LOCALE/symbols/* >> /tmp/latin-small
    grep '0065' loc/$LOCALE/symbols/* >> /tmp/latin-small
    grep '0066' loc/$LOCALE/symbols/* >> /tmp/latin-small
    grep '0067' loc/$LOCALE/symbols/* >> /tmp/latin-small
    grep '0068' loc/$LOCALE/symbols/* >> /tmp/latin-small
    grep '0069' loc/$LOCALE/symbols/* >> /tmp/latin-small
    grep '006A' loc/$LOCALE/symbols/* >> /tmp/latin-small
    grep '006B' loc/$LOCALE/symbols/* >> /tmp/latin-small
    grep '006C' loc/$LOCALE/symbols/* >> /tmp/latin-small
    grep '006D' loc/$LOCALE/symbols/* >> /tmp/latin-small
    grep '006E' loc/$LOCALE/symbols/* >> /tmp/latin-small
    grep '006F' loc/$LOCALE/symbols/* >> /tmp/latin-small
    grep '0070' loc/$LOCALE/symbols/* >> /tmp/latin-small
    grep '0071' loc/$LOCALE/symbols/* >> /tmp/latin-small
    grep '0072' loc/$LOCALE/symbols/* >> /tmp/latin-small
    grep '0073' loc/$LOCALE/symbols/* >> /tmp/latin-small
    grep '0074' loc/$LOCALE/symbols/* >> /tmp/latin-small
    grep '0075' loc/$LOCALE/symbols/* >> /tmp/latin-small
    grep '0076' loc/$LOCALE/symbols/* >> /tmp/latin-small
    grep '0077' loc/$LOCALE/symbols/* >> /tmp/latin-small
    grep '0078' loc/$LOCALE/symbols/* >> /tmp/latin-small
    grep '0079' loc/$LOCALE/symbols/* >> /tmp/latin-small
    grep '007A' loc/$LOCALE/symbols/* >> /tmp/latin-small
```


#### Greek Capital

``` bash
    grep '0391' loc/$LOCALE/symbols/* > /tmp/greek-capital
    grep '0392' loc/$LOCALE/symbols/* >> /tmp/greek-capital
    grep '0393' loc/$LOCALE/symbols/* >> /tmp/greek-capital
    grep '0394' loc/$LOCALE/symbols/* >> /tmp/greek-capital
    grep '0395' loc/$LOCALE/symbols/* >> /tmp/greek-capital
    grep '0396' loc/$LOCALE/symbols/* >> /tmp/greek-capital
    grep '0397' loc/$LOCALE/symbols/* >> /tmp/greek-capital
    grep '0398' loc/$LOCALE/symbols/* >> /tmp/greek-capital
    grep '0399' loc/$LOCALE/symbols/* >> /tmp/greek-capital
    grep '039A' loc/$LOCALE/symbols/* >> /tmp/greek-capital
    grep '039B' loc/$LOCALE/symbols/* >> /tmp/greek-capital
    grep '039C' loc/$LOCALE/symbols/* >> /tmp/greek-capital
    grep '039D' loc/$LOCALE/symbols/* >> /tmp/greek-capital
    grep '039E' loc/$LOCALE/symbols/* >> /tmp/greek-capital
    grep '039F' loc/$LOCALE/symbols/* >> /tmp/greek-capital
    grep '03A0' loc/$LOCALE/symbols/* >> /tmp/greek-capital
    grep '03A1' loc/$LOCALE/symbols/* >> /tmp/greek-capital
    grep '03F4' loc/$LOCALE/symbols/* >> /tmp/greek-capital
    grep '03A3' loc/$LOCALE/symbols/* >> /tmp/greek-capital
    grep '03A4' loc/$LOCALE/symbols/* >> /tmp/greek-capital
    grep '03A5' loc/$LOCALE/symbols/* >> /tmp/greek-capital
    grep '03A6' loc/$LOCALE/symbols/* >> /tmp/greek-capital
    grep '03A7' loc/$LOCALE/symbols/* >> /tmp/greek-capital
    grep '03A8' loc/$LOCALE/symbols/* >> /tmp/greek-capital
    grep '03A9' loc/$LOCALE/symbols/* >> /tmp/greek-capital
```


#### Greek Small

``` bash
    grep '2207' loc/$LOCALE/symbols/* > /tmp/greek-small
    grep '03B1' loc/$LOCALE/symbols/* >> /tmp/greek-small
    grep '03B2' loc/$LOCALE/symbols/* >> /tmp/greek-small
    grep '03B3' loc/$LOCALE/symbols/* >> /tmp/greek-small
    grep '03B4' loc/$LOCALE/symbols/* >> /tmp/greek-small
    grep '03B5' loc/$LOCALE/symbols/* >> /tmp/greek-small
    grep '03B6' loc/$LOCALE/symbols/* >> /tmp/greek-small
    grep '03B7' loc/$LOCALE/symbols/* >> /tmp/greek-small
    grep '03B8' loc/$LOCALE/symbols/* >> /tmp/greek-small
    grep '03B9' loc/$LOCALE/symbols/* >> /tmp/greek-small
    grep '03BA' loc/$LOCALE/symbols/* >> /tmp/greek-small
    grep '03BB' loc/$LOCALE/symbols/* >> /tmp/greek-small
    grep '03BC' loc/$LOCALE/symbols/* >> /tmp/greek-small
    grep '03BD' loc/$LOCALE/symbols/* >> /tmp/greek-small
    grep '03BE' loc/$LOCALE/symbols/* >> /tmp/greek-small
    grep '03BF' loc/$LOCALE/symbols/* >> /tmp/greek-small
    grep '03C0' loc/$LOCALE/symbols/* >> /tmp/greek-small
    grep '03C1' loc/$LOCALE/symbols/* >> /tmp/greek-small
    grep '03C2' loc/$LOCALE/symbols/* >> /tmp/greek-small
    grep '03C3' loc/$LOCALE/symbols/* >> /tmp/greek-small
    grep '03C4' loc/$LOCALE/symbols/* >> /tmp/greek-small
    grep '03C5' loc/$LOCALE/symbols/* >> /tmp/greek-small
    grep '03C6' loc/$LOCALE/symbols/* >> /tmp/greek-small
    grep '03C7' loc/$LOCALE/symbols/* >> /tmp/greek-small
    grep '03C8' loc/$LOCALE/symbols/* >> /tmp/greek-small
    grep '03C9' loc/$LOCALE/symbols/* >> /tmp/greek-small
    grep '2202' loc/$LOCALE/symbols/* >> /tmp/greek-small
    grep '03F5' loc/$LOCALE/symbols/* >> /tmp/greek-small
    grep '03D1' loc/$LOCALE/symbols/* >> /tmp/greek-small
    grep '03F0' loc/$LOCALE/symbols/* >> /tmp/greek-small
    grep '03D5' loc/$LOCALE/symbols/* >> /tmp/greek-small
    grep '03F1' loc/$LOCALE/symbols/* >> /tmp/greek-small
    grep '03D6' loc/$LOCALE/symbols/* >> /tmp/greek-small
```


### Numbers

``` bash
    grep '0030' loc/$LOCALE/symbols/* > /tmp/digits
    grep '0031' loc/$LOCALE/symbols/* >> /tmp/digits
    grep '0032' loc/$LOCALE/symbols/* >> /tmp/digits
    grep '0033' loc/$LOCALE/symbols/* >> /tmp/digits
    grep '0034' loc/$LOCALE/symbols/* >> /tmp/digits
    grep '0035' loc/$LOCALE/symbols/* >> /tmp/digits
    grep '0036' loc/$LOCALE/symbols/* >> /tmp/digits
    grep '0037' loc/$LOCALE/symbols/* >> /tmp/digits
    grep '0038' loc/$LOCALE/symbols/* >> /tmp/digits
    grep '0039' loc/$LOCALE/symbols/* >> /tmp/digits
```

#### Cleanup

* Then do some cleanup on the files. E.g., remove messages like "Latin capital
  letter" etc.
* Use these messages to also cleanup the locale files before generating the spreadsheets.


## Clearspeak specific

* Power methods could be found in `locale-rest/functions.js`
* Number sets could be found in `locale-rest/symbols.js`


# Messages

# Numbers


# Create Spreadsheets

## Symbols, Units, Functions, Currency

* Replace the locale name in the `odsTable` method
* Make symbol spreadsheets

```javascript
SplitJson.toOds(locale);
```

This generates all necessary spreadsheets in directory `/tmp/spreadsheets/iso`.
* Spreadsheets are named:

`currency-iso.ods  functions-iso.ods  symbols-iso.ods  units-iso.ods`
where `iso` stands for the locale.

## Alphanumerics 

* Use the template in `l10/templates/AlphaNumerics.ods`
* Use the cleaned up content from the generated files alphabet and digit files above
* Copy them in to the spreadsheet.


# Pulling Translated Content from Spreadsheets

## Step wise pulling of Symbols, Messages etc.

Stepwise can help with debugging, in case some of the files/targets do not work
correctly. There are combined methods to do pulling properly.

### Pulling Symbols

* Save ODS files as multiple CSV.
* Use methods in `SplitJson` module.


``` javascript
SplitJson.elementsFromCsv('it', SplitJson.SYMBOLS_, '/home/sorge/git/sre/sre-resources/l10n/locales/it/stefano/csv-symbols/', 'Italian');
SplitJson.elementsFromCsv('it', SplitJson.FUNCTIONS_, '/home/sorge/git/sre/sre-resources/l10n/locales/it/stefano/csv-functions/', 'Italian');
SplitJson.elementsFromCsv('it', SplitJson.UNITS_, '/home/sorge/git/sre/sre-resources/l10n/locales/it/stefano/csv-units/', 'Italian');
```

* Currencies might have to by copied over from the English locale if they do not yet exist.
* Make sure that the locale is correct!

``` javascript
SplitJson.elementsFromCsv('it', SplitJson.CURRENCY_, '/home/sorge/git/sre/sre-resources/l10n/locales/it/stefano/csv-currency/', 'Italian');
```

* Cleaning up symbols afterwards to remove empty elements, etc.

1. Removing empty elements. E.g., duals and singulars:

``` javascript
SplitJson.transformLocaleFiles(SplitJson.UNITS_, SplitJson.PATH_ + '/hi/units/', SplitJson.removeDual);
SplitJson.transformLocaleFiles(SplitJson.CURRENCY_, SplitJson.PATH_ + '/hi/units/', SplitJson.removeDual);
SplitJson.transformLocaleFiles(SplitJson.FUNCTIONS_, SplitJson.PATH_ + '/hi/functions/', SplitJson.removeDual);
```

``` javascript
SplitJson.transformLocaleFiles(SplitJson.UNITS_, SplitJson.PATH_ + '/hi/units/', SplitJson.removeSingular);
SplitJson.transformLocaleFiles(SplitJson.CURRENCY_, SplitJson.PATH_ + '/hi/units/', SplitJson.removeSingular);
SplitJson.transformLocaleFiles(SplitJson.FUNCTIONS_, SplitJson.PATH_ + '/hi/functions/', SplitJson.removeSingular);
```
2. Check if there are any singular or dual elements left.
3. Swap singular for default/plural.

``` javascript
SplitJson.transformLocaleFiles(SplitJson.UNITS_, SplitJson.PATH_ + '/hi/units/', SplitJson.swapSingularForPlural);
SplitJson.transformLocaleFiles(SplitJson.CURRENCY_, SplitJson.PATH_ + '/hi/units/', SplitJson.swapSingularForPlural);
```

4. Possibly remove empty elements entirely? No method yet for this.

### Pulling Locale Messages

These are primarily on the `Messages` spreadsheet but also on the
`AlphaNumerics` sheet. They go either into the `locale` message file or into the
alphabet file.

* Fonts (in `AlphaNumerics`): `FONT`
* Embellished Characters (in `AlphaNumerics`): `EMBELLISH`


``` javascript
SplitJson.writeAssocList('LOC/csv-alphanumerics/Fonts.csv', '/tmp/fonts.json', 'Font Name English', 'Font Name Locale', 'Font Name English');
SplitJson.writeAssocList('LOC/csv-alphanumerics/Embellished\ Characters.csv', '/tmp/embellished.json', 'Unicode Embellishment Name', 'Embellishment Name Locale', 'Embellishment Name English' );
```

* Roles (in `Messages`) `ROLE`
* embellished (in `Messages`): `ENCLOSE`
* navigate (in `Messages`): `NAVIGATE`

``` javascript
SplitJson.writeAssocList('LOC/csv-messages/Roles.csv', '/tmp/roles.json', 'Role', 'Locale', 'English');
SplitJson.writeAssocList('LOC/csv-messages/Enclose.csv', '/tmp/enclose.json', 'Enclose Type', 'Locale', 'English');
SplitJson.writeAssocList('LOC/csv-messages/Navigation.csv', '/tmp/navigation.json', 'English', 'Locale', 'English');
```

* Replace all the `"` with `'` and copy over to the respective enumerate
  elements in the locale file.
* Make sure to pay attention to combiners on fonts and embellish!
* Replacement of navigation should be done manually element by element (it is only 3!)

### Pulling Speech Rule Messages

* Before generating csv files copy the mathspeak disambiguation messages without
  procedural entry to the next sheet.
* Mathspeak disambiguation messages work similar to the other localisable messages

``` javascript
SplitJson.writeAssocList('LOC/csv-messages/Mathspeak\ disambiguation.csv', '/tmp/mathspeak.json', 'Proc Message', 'Locale', 'English');
```

For the other messages proceed as follows:

* Create a new speech rule file by copying the English one.

``` shell
mkdir src/mathmaps/LOC/rules
cp src/mathmaps/en/rules/clearspeak_english.js src/mathmaps/LOC/rules/clearspeak_LOCALE.js
cp src/mathmaps/en/rules/mathspeak_english.js src/mathmaps/LOC/rules/mathspeak_LOCALE.js
cp src/mathmaps/en/rules/prefix_english.js src/mathmaps/LOC/rules/prefix_LOCALE.js
cp src/mathmaps/en/rules/summary_english.js src/mathmaps/LOC/rules/summary_LOCALE.js
```

* Update the locale in the respective rule file.
* Use functionality in `rewrite.js` (This should be integrated with the SplitJson module.)

* __In clearspeak the `[t] "ft"` element  should remain untranslated!

__This will be no longer necessary once we have the modern rule syntax.

### Pulling alphanumerics

__This is currently done manually but should be improved once we have the newly
outsourced elements.__

``` javascript
SplitJson.getAlphaJSON('/nb/CSV/', '/tmp/', 'nb', 'Bokmål');
SplitJson.getNumbersJSON('/nb/CSV/', '/tmp/', 'nb', 'Bokmål');
```


## One Step Pullling

This assumes the following:

* Localisation is done with the usual spreadsheets
* All spreadsheets are exploded into component csv files
* All csv files are a in common CSV directory

Arguments are as follows:

* `csv`: The csv input directory, relative to `SplitJson.CSV_PATH_`.
* `out`: The output directory for the files. This is absolute. Files are overwritten.
* `iso`: The locale's iso designation.
* `locale`: The locale name. This is used for messages etc.
* `src`: Optionally the source locale name. This is used for picking the
  original messages. It defaults to English.

### Pulling Symbols

Note this does not need an out directory as it replaces directly in the sre files.

``` javascript
SplitJson.getUnicodeJSON(csv, iso, locale, src);
```

Also note that this should only be run once, otherwise there are side-effects on
units and currency files, like superfluous `plural` entries.

### Pulling Messages

``` javascript
SplitJson.getMessagesJSON(csv, out, iso, locale, src);
```
### Pulling Alphanumerics

``` javascript
SplitJson.getAlphaJSON(csv, out, iso, locale, src);
SplitJson.getNumbersJSON(csv, out, iso, locale, src);
```

Note that the numbers will contain rest elements that need to be removed or
alternatively used for additional messages.
