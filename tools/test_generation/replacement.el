;;; This is mainly MathSpeak
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

;;; Careful, does not work when style is not given (in case of optional style
;;; argument!)
(defun sre-replace-all-test (style position)
  (interactive "M" "n")
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
  (search-forward ",")
  (search-forward "'")
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


;;; Clearspeak style tests

(defun sre-replace-clearspeak (position)
  (interactive "n")
  ;;; We search sequentially. Not by style!
  (search-forward "''")
  (backward-char 1)
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
  )


(defun sre-replace-all-clearspeak (position)
  (interactive "n")
  (let ((result t))
    (while result
      (condition-case ex
          (sre-replace-clearspeak position)
          ('error (setq result nil))))
    )
  )


(defun sre-remove-clearspeak-expected ()
  (interactive)
  (search-forward "var speech = ")
  (search-forward "'")
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

(defun sre-remove-all-clearspeak-expected ()
  (interactive)
  (let ((result t))
    (while result
      (condition-case ex
          (sre-remove-clearspeak-expected)
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


(defun sre-extract-text-string ()
  (interactive)
  (search-forward "[t] \"")
  (backward-char 1)
  (forward-char 1)
  (let ((start (point))
        (end (progn
               (search-forward "\"")
               (backward-char 1)
               (point)
               )))
    (copy-region-as-kill start end))
  (other-window 1)
  (yank)
  (newline)
  (other-window 1)
  )


(defun sre-extract-all-text-strings ()
  (interactive)
  (let ((result t))
    (while result
      (condition-case ex
          (sre-extract-text-string)
          ('error (setq result nil))))
    )
  )

