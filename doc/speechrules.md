# Speech Rules Redesign

## TODO list

* How to deal with basenumbers?
* Articles need to be dealt with explicitly: grammar mapping for
  article. Different per locale!


* Rewrite all | to or in boolean constraints!
* Singleton set rule in clearspeak could be better.

* Matrix_EndVector with the `det` example yields `start determinant ... end matrix`.
* Clearspeak: composed function does not propagate with implicit operator.
* Italian: Add speech rules for the capital power, similar to French?


## Rule stores

* Should be able to parse:
  * Rules (as before, but should be phased out)
  * Preconditions and Actions
  * Alias, Aliases, SpecializedRules
    Alias: Adds a new precondition constraint for `default` style only.
    Aliases: Adds a new precondition constraint for all existing dynamic constraints.
    SpecializedRules: Adds a new dynamic constraint for a given rule.
  * SpecializedAction needs to be renamed to regular rule with unique name
    
  

* Each gets a precondition list:
  * Map names to lists of preconditions
  * Actions find precondition and define a rule
  

* Inheritance:
  base: base locale store
      * base rules + base preconditions (they have dynamic constraints without locale?) 
      * Rules are NOT added to the trie!
  locale store: 
      * rules + preconditions with locale
      * Inherit base rules by adding them for their locale
      * Inherit preconditions, into a separate map. 
        If they are picked they need to have the locale added separately.
        What about override? 
        1. Locale adds a precondition (same name)?
        2. Locale does not need certain preconditions?
  locale actions: loaded into the locale store of the same domain and modality?


### Things to cleanup

* `undefined` in rule ranks.

### IMPORTANT:

Italian pr -> per

### Mathspeak

* underbar/overbar + enclose aliases
* smallroots in particular, roots in general
* omit-font with single or double characters: string-length should be done via
  .split() method to account for upper plane unicode characters.


### Clearspeak

* Hindi: Protected rule?
* German: omit-font (DONE)
    * Durchschnitt zu Schnittmenge for `set-prefix-operators` rule.
    * `superscript-ordinal-prefixop` is actually an alias for `superscript-ordinal` 
      Can we handle that?

* Rename actions to rules
    * Rename set(-not)-member-(.*) to set-in etc.


* English: Inspect why we needed the unit:length constraint?
    * This is also needed in Hindi

* French: Investigate `superscript-ordinal-number`


* More cleanup: endmatrix elements.
