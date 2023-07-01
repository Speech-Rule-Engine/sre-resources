## Second semantic phase

* Semantic ordering: Decides when a type/role combination is stronger than
  another on the seame symbols.
* Semantic postprocessor: Combines a semantic ordering with a method that
  restructures the tree.


* __Alternative:__ We could in some instances just reparse the tree, and make
  decisions on role/type wrt. to the already propagated semantic table.
* Only if the semantic table contains twice the same expression with different
  semantic assignment.

* Leaf map: id to node, symbol to ids? Maybe directly: Symbol to nodes?
* Branch map: basic string to nodes.  Here base string is the xml string without
  attributes.  *Does that make sense?*

* Maps are stored in the factory.

### Semantic Defaults

Default mapping for looking up the semantics of elements. That should overwrite
the standard intepretations.

  * Map symbol to type/role.
  * What about fonts? We map symbol + font to what?
  * Generate defaults from multi-valued mappings.

Three parts: default, collator, ordering

  * Collator collects semantic meanings per node.
  * Orderings collapse them into a default.
  * Default is used to either rewrite a tree or to be used for a parse.


  * Defaults can also be pre-filled.
  * We need to extend the semantic parser to allow for defaults.


# Continued Fraction notations!

Push info through from cfrac macro.

https://tex.stackexchange.com/questions/73195/how-to-typeset-a-continued-fraction-in-the-following-format

https://tex.stackexchange.com/questions/196574/a-notation-for-continued-fractions

# Function composition vs implicit multiplication.

    * Work out the cases for implicit function compoistion.
    * Add some appropriate meaning element. (general?)
    * Get feedback loop if a function occurs in operation with other clearly non-functions
      (e.g., Clearspeak ). This would need a branch node lookup/comparison.

# Improved removal of mrows:
  * bracketing goes wrong in:
  sre.NobleEnglishTest.prototype.testSample_38

  * Mfenced stuff: some enrichment problems.
  * Improved recognition of fences: What about empty vs not empty?
    sre.ClearspeakPart2Symbols.prototype.testVertLine003 is a good example.
  *

### Other Notes:

Improve:
\textrm{exp}(A)=I+A+A^2/2!+A^3/3!+\dots

(p-1)!^n

Try this:
https://math.meta.stackexchange.com/questions/28253/how-to-set-name-above-a-part-of-a-matrix


# New puncutation algorithm:

Better treatment of ellipses

* if ellipses:
  first element: if next element is punctuation, then not punctuation, o/w punctuation
  last element: if previous element punctuation, then not punctuation, o/w punctuation
  middle element:
     previous element and next element punctuation -> then not punctuation
     previous element and next element text -> not punctuation

# After Simons

The following are heuristics inspired by simons. 


... Need to write up the entire heuristics package ...

## Text analysis heuristics

### Analysis of single text elements

* Annotation-XML gets role `annotation`
* MS gets role `string`
* Spaces get role `space`
* If `textContent` contains spaces it will get role `text`.

Everything else will be further classified

* Elements with one symbols:  (Maybe we can simply ignore them for now and only reclassify in context?)

1. if identifier or number they will be reclassified as such.
2. otherwise they will retain type text and role `uknown`. They have the
   potential to be reclassified if they are outside a text context.
   
   Rational: something like `\text{(}\text{case}\text{)} should be retained as a
   text.

* Elements with multiple symbols:

1. They will get the number classification.
   1. If they are a number (i.e., not `othernumber` role) they will get fully
      reclassified as number.
   2. If they contain some sort of punctuation (i.e., is not only numbers and
      identifiers), they will remain type `text` and classified as `annotation`
      _Rational_: \text{(1)} usually a label.
   3. Otherwise they have the potential to be (prefix) functions or units. This
      needs to be determined from context. We therefore classify them initially
      as `text` and `unknown`. Note, that they can contain only letters or a mix
      of letters and numbers. Note also, that they are the only multi character
      `text` elements now that have class `unknown`.
   
### Analysis of rows paritioned by text elements

They can contain three types of text elements: 

1. Proper ones with roles `annotation, string, space, text`
2. Single symbol elements with `unknown` roles.
3. Multi character elements (letters or numbers only) with role `unknown`.

The goal is now to combine as much as possible these elements as well as further
classify those of type 3.

* If only one text element in row, then give it role `annotation`.  
  _Rational_: In this case it is probably a singleton in a cell, as in a case
  statement or as a label.
* We then partition the row by finding all text elements then we
  1. If all comp elements are empty then combine with role `annotation`.
     _Rational_: as above.
  1. initially combine contiguous text elements into a single punctuated element with
    `text` or `annotation` role (the latter if all are annotations).
  2. Now we know that the partition is proper, that is the only empty elements in
    `comp` can be the first and last element.
  3. Now we classify the `unknown` elements by first computing their meaning:
     * If meaning is not `unknown` reclassify accordingly, otherwise
     * Those at start or middle will be turned into `prefix functions`
     * Those at the end will become `unit`
     The corresponding comp elements will get merged.
  4. Combine the comp elements into single semantic nodes.
  5. Combine the row to a single punctuated dummy node.
  
This is the idea of the algorithm. In order to avoid multiple passes of the
partition, we shall combine steps 2-4 into a single step.
    

This is the actual algorithm:




