(fset 'make-cap-letters
   [?\C-s ?c ?a ?p ?  left ?\M-c ?\C-e])

(fset 'remove-short-default
   [?\C-s ?s ?h ?o ?r ?t ?\" right right ?\C-  ?\C-r ?d ?e ?f ?a ?u ?l ?t right right right right right right right right right ?\C-w ?  ?\C-e ?\C-s ?m ?a ?p ?p ?i ?n ?g ?s down ?\C-a])

(fset 'remove-default-short
   [?\C-s ?d ?e ?f ?a ?u ?l ?t ?\" ?: ?  ?\" left ?\C-  ?\C-s ?s ?h ?o ?r ?t ?\" ?: right ?\C-w ?\C-e ?\C-s ?m ?a ?p ?p ?i ?n ?g ?s ?\C-a])

(fset 'sre-rewrite-actual-expected
   [?\C-s ?\C-  ?\C-s ?a ?c ?t ?u ?a ?l right right ?\C-w ?\C-e backspace right ?\C-  ?\C-s ?: ?  left right ?\C-w backspace ?  ?\C-e backspace ?\] ?\C-a ?\[ ?\C-e right])

(fset 'sre-rewrite-output
   [?\C-s ?a ?c ?t ?u ?a ?l ?\C-a ?\C-w ?\C-s ?e ?x ?p ?e ?c ?t ?e ?d ?\C-e ?\C-s ?o ?p ?e ?r ?\C-a ?\C-k down])

(fset 'remove-mathspeak
   [?\C-s ?m ?a ?t ?h ?s ?p ?e ?a ?k ?\C-a left left ?\C-  ?\C-s ?\} left right ?\C-w])

;; Start before the one you want to copy.
(fset 'sre-copy-old-to-new-mapping
   [?\C-s ?k ?e ?y ?\" ?: ?  ?\" right left ?\C-  ?\C-s ?\" left ?\M-w ?\C-x ?o ?\C-s ?\M-y ?\C-e ?\C-s ?d ?e ?f ?a ?u ?l ?t ?\" ?: ?  ?\" left right ?\C-  ?\C-s ?\" left ?\C-w ?\C-x ?o ?\C-s ?\" ?d ?e ?f ?a ?u ?l ?t ?\" ?: ?  ?\" left right ?\C-  ?\C-s ?\" left ?\M-w ?\C-x ?o ?\C-y ?\C-e ?\M-< ?\C-x ?\C-s ?\C-x ?o ?\C-s ?c ?a ?t ?e ?\C-e right])

;; Swaps category and key, if key is last and category is first in entry.
;; Result will be an entry where key is first and category is last.
(fset 'sre-swap-key-category
   [?\C-s ?c ?a ?t ?e ?g ?o ?\C-a ?\C-k ?\C-k ?\C-s ?k ?e ?y ?\" ?: ?\C-a ?\C-y ?\C-k ?\C-k left backspace ?\C-r ?m ?a ?p ?p ?\C-a ?\C-y left ?, ?\C-s ?c ?a ?t ?e ?g ?o ?\C-e right])
