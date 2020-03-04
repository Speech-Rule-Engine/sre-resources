# Redesign how unicode mappings are handled

## Build unit tests for characters

- [x] English 
  - [x] Default
  - [x] Mathspeak
  - [x] Clearspeak
- [x] Spanish
  - [x] Default
  - [x] Mathspeak
- [x] English 
  - [x] Default
  - [x] Mathspeak
  - [x] Clearspeak
- [x] Nemeth

 ## Cleanup ideas

 ### Simplification of rule sets

 #### Default (ChromeVox) rule set

- [x] Rename short as brief __short/alternative are removed__
    * Remap short to brief in the API
    * Should we keep alternative?
- [x] Rewrite all alphabets 
    - [x] to use capital letters for caps
    - [x] to make default same as clearspeak
      Exceptions: Relations ("is equal to"); Delimiters open/close
    - [x] remove latin character etc. naming?
    - [x] Fix all the tests.
- [x] Rewrite numbers to digits 
    * Digits larger than 9. Automatically generate? __Yes__
    * For default keep named numbers rather than digits.
- [ ] Fixes in the general rule set:
    - [ ] Problem with prefix + of. That should not happen. see issue 320


#### Other rule sets

- [x] Add numbers to the localised digits
- [x] Remove every dashed element (this could be problematic on French locale, etc.)
    - [ ] French Hyphenated numerals.
- [ ] French: Make alternatives for parentheses clearspeak defaults?
- [ ] Clearspeak
    - [x] Incorporate preferences into cyclometric function mappings
    - [ ] Adapt handling of cyclometric functions without argument in the speech rules
    - [ ] Rewrite sub/superscripts and parenthesis in math_symbols
    - [ ] super and subscript numbers in clearspeak/mathspeak
    - [x] French: Handling of triangle for delta
- [ ] Nemeth: work on
  - [x] digits_rest (vulgar fractions)
  - [x] digits_rest (circled/squared numbers)
  - [x] latin_rest (remove what is not needed)
  - [x] remove nablas and partial diffs
  - [ ] Greek alternative letters.



### Alphabets

- [x] Generate alphabets automatically,
    - [x] use localised font and cap/upper
- [x] extend to latin-rest character sets parenthesized, squared, circled etc.
    - [X] Add pseudo fonts for these.
    - [x] Needs multiple mappings per style super/sup sub etc. and functions for
      combination, i.e. bold 1 vs. 1 comma.
    What about diacritical marks (combining)? __No not systematic enough__
- [ ] Greek lamda in en should maybe be lambda!
- [ ] italic should be removed from italic mathfont characters!
    Do this during generation or during correction?

### Digits

- [x] Simplify math digits
- [x] Standardize circled/negative circled etc.
- [x] Pseudo fonts as in alphabets
- [ ] Spanish: Check if ordinals are correct.
- [ ] Spanish: Add wordOrdinals method.

### Functions

- [x] Short vs default for mathspeak etc.
- [x] French: Add the inverse hyperbolic and cyclo functions
- [x] Localisation of elementary functions like lcm, gcd, etc
        Done for French and Spanish

## General Redesign

- [x] Alphabet handling
- [x] Digit handling
- [x] File handling
- [x] Locale loading
- [x] JSON file creation for distribution (not used!)
    ```bash
        jq -c -s add *.js
    ```
### Redesigning JSON files and Make

- Use `jq` instead of `json-minify`? While jq is available on every platform, it
  forces a new non-javascript dependency. That will make it more difficult for
  others to compile SRE as well as make a move to webpackaging harder.
- `jscompress` could also combine json files. However it is not available on `npm`.
- Keep a structure similar to what we have for the IE maps to minimise efforts.

- [x] Initial step with front-loading
  - [x] Combine JSON files into a single file, one per locale.
  - [x] Load each locale file
  - [x] Combine parsing mechanism of IE with general one.
  - [x] How to deal with IE? Initially have a single mapping with locales.
- [x] Change front-loading to selective loading by locale only
  - [x] Default loading of English? Unless locale is given a priori?


### Alphabets

* Per alphabet have range for upper and lower.  Additionally substitution. 

    Example: fraktur fonts: `[1D514, 211C]` for fraktur cap R
    
* Generate alphabets programmatically, filling the mappings 
  (maybe later filling the rule directly?)

* Allow for additional loading of rule set specific overwrites.
  Example: triangle in Clearspeak overwrites the original cap Delta.

* First generate, then overwrite.

#### Warning

* Need a tool to extract ranges to be correct!

* Make sure not to forget any clearspeak preferences.

### Digits

Same as alphabets


### Locales

Should only be loaded when they are actually used. 
That includes both loading and generation of alphabet rules.


### Testing:

Initially we need to check loading time vs. generation time of alphabets.


### Semantic 

Exploit this in semantic attributes!

- [ ] <mn>-1</mn> should be treated like <mo>-</mo><mn>1</mn>

## German

- [ ] Get box characters names from Wikipedia
- [ ] Still some English equals etc. 
- [ ] Clearspeak:  Propagate the font rules for SayCaps from German to English, French.
