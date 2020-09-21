(defun rewrite-mml-json-test ()
  (interactive)
  (search-forward "\"tests\": {")
  (forward-line 1)
  (catch 'search-failed
    (while (search-forward "\": {" nil t)
      (beginning-of-line)
      (let ((beg (point)))
        (search-forward "speech")
        (beginning-of-line)
        (kill-ring-save beg (point))
        (forward-line 1)
        (search-forward "speech")
        (beginning-of-line)
        (insert "},\n")
        (yank)
        (forward-line 1)
        (search-forward "speech")
        (beginning-of-line)
        (insert "},\n")
        (yank)
        ))
    (beginning-of-buffer)
    (while (search-forward "\"test\": " nil t)
      (search-forward "preference\": \"")
      (let ((beg (point)))
        (search-forward "\",")
        (backward-char 2)
        (kill-ring-save beg (point))
        (search-backward ": {")
        (backward-char 1)
        (insert "_")
        (yank)
        (search-forward "\"test\": ")
        (forward-line 1)
        ))
    )
  (beginning-of-buffer)
  )
