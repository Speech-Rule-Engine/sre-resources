(defun sre-replace-test (style position)
  (interactive "M" "n")
  (search-forward style)
  (search-backward "''")
  (forward-char 1)
  (other-window 1)
  (search-forward "<tr>")
  (search-forward "<td>" nil nil position)
  (let ((start (point))
        (end (progn
               (search-forward "</td>")
               (backward-char 5)
               (point)
               )))
    (copy-region-as-kill start end))
  (search-forward "</tr>")
  (other-window 1)
  (yank)
  (search-forward style)
  )


(defun sre-replace-all-test (style position)
  (interactive)
  (let ((result t))
    (while result
      (condition-case ex
          (sre-replace-test style position)
          ('error (setq result nil))))
    )
  )


(defun sre-remove-test-expected ()
  (interactive)
  (search-forward "this.execute")
  (search-forward ", '")
  (print "0")
  (print (point))
  (let ((start (point))
        (end (progn
               (search-forward "'")
               (1- (point)))))
    (print start)
    (print end)
    (delete-region start end)
    )
  )

(defun sre-remove-all-test-expected ()
  (interactive)
  (let ((result t))
    (while result
      (condition-case ex
          (sre-remove-test-expected)
          ('error (setq result nil))))
    )
  )

(fset 'remove-test-expected
   [?\C-s ?, ?  ?\' left right ?\C-  ?\C-s ?\' left ?\C-w ?\C-e right])

(fset 'replace-verbose-tests
   [?\C-s ?\' ?d ?e ?f ?a ?u ?l ?t ?\' left ?\C-r ?\' ?\' left right right ?\C-x ?o ?\C-s ?< ?/ ?t ?r ?> left ?\C-r ?< ?t ?d ?> left right right right right right ?\C-  ?\C-s ?< ?/ ?t ?d ?> left left left left left ?\M-w ?\C-e right ?\C-x ?o ?\C-y ?\C-e down ?\C-a])

(fset 'replace-brief-tests
      [?\C-s ?\' ?b ?r ?i ?e ?f ?\' left ?\C-r ?\' ?\' left right right ?\C-x ?o ?\C-s ?< ?/ ?t ?r ?> left ?\C-r ?< ?t ?d ?> left right right right right right ?\C-  ?\C-s ?< ?/ ?t ?d ?> left left left left left ?\M-w ?\C-e right ?\C-x ?o ?\C-y ?\C-e down ?\C-a])

(fset 'replace-sbrief-tests
   [?\C-s ?\' ?s ?b ?r ?i ?e ?f ?\' left ?\C-r ?\' ?\' left right right ?\C-x ?o ?\C-s ?< ?/ ?t ?r ?> left ?\C-r ?< ?t ?d ?> left right right right right right ?\C-  ?\C-s ?< ?/ ?t ?d ?> left left left left left ?\M-w ?\C-e right ?\C-x ?o ?\C-y ?\C-e down ?\C-a])

(fset 'replace-prefix-tests
   [?\C-s ?\' ?\' left ?\C-x ?o ?\C-s ?< ?/ ?t ?r ?> left ?\C-r ?< ?t ?d ?> ?\C-r left right right right right right ?\C-  ?\C-s ?< ?/ ?t ?d ?> left left left left left ?\M-w ?\C-e right ?\C-x ?o ?\C-y ?\C-e down ?\C-a])

