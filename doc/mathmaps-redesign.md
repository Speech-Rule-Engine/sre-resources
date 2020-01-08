# Redesign how unicode mappings are handled

## Build unit tests for characters

- [ ] English 
  - [ ] Default
  - [ ] Mathspeak
  - [ ] Clearspeak
- [ ] Spanish
  - [ ] Default
  - [ ] Mathspeak
- [ ] English 
  - [ ] Default
  - [ ] Mathspeak
  - [ ] Clearspeak
- [ ] Nemeth

## Cleanup ideas

### Simplification of rule sets

#### Default (ChromeVox) rule set

- [ ] Rename short as brief
- [ ] Rewrite all alphabets 
    - [ ] to use capital letters for caps
    - [ ] to make default same as clearspeak
    - [ ] remove latin character etc. naming?
- [ ] Rewrite numbers to digits 


#### Other rule sets

- [ ] Add numbers to the localised digits
- [ ] Remove every dashed element (this could be problematic on French locale, etc.)


### Alphabets

- [ ] Generate alphabets automatically,
    - [ ] use localised font and cap/upper
    - [ ] extend to latin-rest character sets parathesized, squared, circled etc.
            What about diacritical marks (combining)?


### Digits

- [ ] Simplify math digits
- [ ] Standardize circled/negative circled etc.


## General Redesign

- [ ] Alphabet handling
- [ ] Digit handling
- [ ] File handling
- [ ] Locale loading
- [ ] JSON file creation for distribution

### Alphabets

* Per alphabet have range for upper and lower.  Additionally substitution. 

    Example: fraktur fonts: [1D514, 211C] for fraktur cap R
    
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

