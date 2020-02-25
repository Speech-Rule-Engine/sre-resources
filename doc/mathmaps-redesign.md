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
- [ ] Rewrite all alphabets 
    - [x] to use capital letters for caps
    - [x] to make default same as clearspeak
      Exceptions: Relations ("is equal to"); Delimiters open/close
    - [x] remove latin character etc. naming?
    - [ ] Fix all the tests.
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
    - [ ] Incorporate preferences into cyclometric function mappings
    - [ ] Adapt handling of cyclometric functions without argument in the speech rules
    - [ ] Rewrite sub/superscripts and parenthesis in math_symbols
    - [ ] super and subscript numbers in clearspeak/mathspeak
    - [x] French: Handling of triangle for delta



### Alphabets

- [x] Generate alphabets automatically,
    - [x] use localised font and cap/upper
- [ ] extend to latin-rest character sets parenthesized, squared, circled etc.
    - [X] Add pseudo fonts for these.
    - [ ] Needs multiple mappings per style super/sup sub etc. and functions for
      combination, i.e. bold 1 vs. 1 comma.
    What about diacritical marks (combining)? __No not systematic enough__
- [ ] Greek lamda in en should maybe be lambda!
- [ ] italic should be removed from italic mathfont characters!
    Do this during generation or during correction?

### Digits

- [x] Simplify math digits
- [x] Standardize circled/negative circled etc.
- [x] Pseudo fonts as in alphabets

### Functions

- [ ] Short vs default for mathspeak etc.
- [x] French: Add the inverse hyperbolic and cyclo functions
- [ ] Localisation of elementary functions like lcm, gcd, etc

## General Redesign

- [ ] Alphabet handling
- [ ] Digit handling
- [ ] File handling
- [ ] Locale loading
- [ ] JSON file creation for distribution
    ```bash
        jq -c -s add *.js
    ```

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
