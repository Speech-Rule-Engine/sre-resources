## 5/2/20

* micro gram: How to change from Greek to English
  alphabet 

    every time except with English in sequence 
  
* What about all caps things GBP: One indicator or every time?
    cap indicator every time.
  
* The fonts
    * Normal font indicators. 
    * What about embellished ones?
    
If the element is touching the opening grouping symbol (i.e., space before)
there is not need for indicator.

We also don't need an English or number indicator inside enclosed structures.
(Or maybe yes... Michael will look)


* What about changes of alphabets in text?

Only for foreign words per letter.

* Prefix functions: do they always have a space?

Indeed.

* Currency symbols? How do deal with those in a maths context?
    * Is dollar/cent enough? Any others?
    * Are fonts at all important there? NO!
    
## 21/3/20

* Evaluator:

1. degree symbol is written with superscript (and baseline) [Page 17-2]
2. Abbreviations with multiple capitals.
3. Currencies
4. Angstrom: Space before and after, unless between ang and punctuation.


* AATA


Spacing problems: 71, 92 (thick), 65, 175 (thin)

47: Something wrong with the punctuation!
136, 176, 229: degree
198: factorial does not fire!
215: Missing baseline!
248: Superfluous baseline!
249: Simple subscript for numberset!  DONE (not numberset!)
263: element
265: arrow
267: tilde relation + element
269: char is a function
275: negative + script?
283: arrow
293: element
295, 297: odd space
304: No baseline before comma


305, 308, 309: arrow


314: fix l  DONE
315: Fix arrow and colon
317: Weird arrow! Needs to be sorted in symbols!
319: Temporary rule for infixop/element DONE

Michael
Why are the arrows so small? Is there a rule when to use contracted vs non-contracted? (10.7)
6: Why is it long in 6 (due to stacked element)? YES

214, 270, 311: cis is a prefix function. On the other hand Inn(246) or Hom(245) are not.

24: bold indicator missing? YES

30, 64: Why is there no space after ellipsis? Because there is a punctuation operator? DONE
65, 175, 226: Why is the grouping made explicit? Usually this is just a visual aid. DONE
Grouping or related punctuation

112: Why are there number indicators? Is the not an enclosed list? (Feedback: needs further discussion!)

216 vs 247: One with, one without double cap indicator

254 vs 256: This is actually multiplication. Still double cap?


269: why English indicator ⠰  (change of font?)
316, 240: Colon: ⠸⠒  vs ⠐⠂?? I think it is in mapping notation. (13.7.1)
14, 19: Colon in set is a "such that". Why is there no space afterwards?

266, 285, 320: Double-struck: ⠈ not ⠸
321: ⠘⠨⠡ or  ⠨⠡
291, 327: tilde here is a relation? (13.7.2)

---------------------------------------------------------------

New questions:

* 314 vs 7.5-5: script l

**** Ignoring 7.5.2


// Things changed in the tests:


* non-controversial (agreed the other call)

24: bold zero

98: Added space in spaced number

112: Removed number symbols

254: Same as in 256

261, 267: This is setbuilder (set comprehension) notation!

282: lcm why is there no space?



* novel agreement 

Cycles code strings etc: Currently interpreted as vectors: number symbols
    everywhere, but NOT enlarged fences. This could be changed!

47, 71, 92

Adapted 242 to correspond to 216 (i.e., double caps indicator for GF)


* Potentially Controversial

- Ratio is still very unclear:

216

The main reason is that I do not understand the concept of a mapping notation vs
a ratio. Examples on pages 4-16 to 4-17 make it not clear to me: 

14 I've added English letter indicators for the bold letters. 

The entire chapter "Introdution to the English Letter Indicator" is rather
unclear to me and in parts seems contradictory.

- English letter indicator

Why do we use an English indicator in 269? Because there is a preceding space? 
But since char is a function is that not the same treatment as sin x?

Why do we not need ELI for bold characters in 14/24?

============================================
Still failing:
============================================

✕ AataExpression_337 (4 ms)

Semi-product
