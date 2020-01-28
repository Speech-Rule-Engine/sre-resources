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

- [ ] Rename short as brief
    * Remap short to brief in the API
    * Should we keep alternative?
- [ ] Rewrite all alphabets 
    - [ ] to use capital letters for caps
    - [ ] to make default same as clearspeak
    - [ ] remove latin character etc. naming?
- [ ] Rewrite numbers to digits 
    * Digits larger than 9. Automatically generate? __No decided against__


#### Other rule sets

- [ ] Add numbers to the localised digits
- [ ] Remove every dashed element (this could be problematic on French locale, etc.)


### Alphabets

- [ ] Generate alphabets automatically,
    - [ ] use localised font and cap/upper
- [ ] extend to latin-rest character sets parenthesized, squared, circled etc.
    - [ ] Add pseudo fonts for these.
    What about diacritical marks (combining)? __No not systematic enough__


### Digits

- [ ] Simplify math digits
- [ ] Standardize circled/negative circled etc.
- [ ] Pseudo fonts as in alphabets

## General Redesign

- [ ] Alphabet handling
- [ ] Digit handling
- [ ] File handling
- [ ] Locale loading
- [ ] JSON file creation for distribution

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
