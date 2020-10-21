# Tools folder

All kinds of helper scripts. Many outdated. None production ready!

## Braille

Braille related tools

* `cli-braille.js`: Executable script for generating Unicode Braille code from
  ASCII number input
* `tools.js`: Transformer script for translating SRE symbol files to
  Braille. Might be a bit outdated.


## l10n

* `chars-rewrite.el`: Some rewriting of Characters for capitalisation
* `extract-alphabets.sh`: Obsolete script to extract alphabet content from symbol files.
* `extract_currency.sh`: Extract currency values from MP files.
* `extract_functions.sh`: Extract functions values from MP files.
* `extract.sh`: Combine all four extraction files for all locales.
* `extract_unicode.sh`: Extract unicode values from MP files.
* `extract_units.sh`: Extract unit values from MP files.
* `numbers.js`: Numbers rewriting methods (combine wtih `split-json` ?)
* `rewrite.js`: Some symbol files rewriting methods (combine wtih `split-json` ?)
* `split-json.js`: Main methods to generate l10n files. This needs `shelljs`.


## Misc

Miscellaneous scripts, mostly outdated. 

* `helper.el`: Rewriting descriptions in SVG files.
* `issues.js`: Should already be part of the tests?
 

## Test Generation

Scripts for test generation. Some of them are live!

* `char_test_output.js`: Generates json test files from base and locale
  files. This one is live and very useful.
* `fill-tests.js`: Fills some missing tests in expected files. This is for more
  general tests. Should be generalised and combined with `char_test_output.js`
  during next l10n.
* `replacement.el`: Various Emacs functions for replacing expected for actual in files.
  As well as extraction of text strings from speech rule files. Useful for l10n?



## Test Rewrite

Scripts used for rewriting tests from code to json format. Mostly outdated, but
some might contain useful bits of scripts in `sed` etc.


* `char_rewrite.js`: Rewrites char json files.
* `rename_samples.js`: Renames `SampleX_` names of tests into meaningful,
  correctly enumerated names. Very useful!
* `rewrite-tests.el`: Rewrite methods for tests.
* `stree_rewrite.js`: Rewrite methods for semantic tree outputs in tests.
* `test_rewrite2.sh`: Rewrite script for tests (probably obsolete)
* `test_rewrite3.sh`: ditto
* `test_rewrite_chars.sh`: ditto
* `test_rewrite-final.sh`: Splits json test files into `base` and `expected`. Still useful.
* `test_rewrite-prefix.sh`: ditto as above
* `test_rewrite.sh`: ditt as above
* `test_rewrite_stree.sh`: ditto as above

