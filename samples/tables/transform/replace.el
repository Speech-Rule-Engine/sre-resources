(defun replace-all ()
  (interactive)
    (search-and-replace-all "<disp-formula content-type=\"math/tex\">\\s-*<tex-math>"
                        "\n<P>\n\\\\[\n")
    (search-and-replace-all "</tex-math>\\s-*</disp-formula>"
                        "\n\\\\]\n</P>\n")
    (search-and-replace-all "<inline-formula content-type=\"math/tex\">\\s-*<tex-math>"
                        "\n<P>\n$")
    (search-and-replace-all "</tex-math>\\s-*</inline-formula>"
                        "$\n</P>\n")
  )

(defun replace-display ()
  (interactive)
  (search-and-replace-all "<inline-formula content-type=\"math/tex\">\\s-*<tex-math>\.*</tex-math>\\s-*</inline-formula>" "")
  (search-and-replace-all "<disp-formula content-type=\"math/tex\">\\s-*<tex-math>"
                        "\n<P>\n\\\\[\n")
  (search-and-replace-all "</tex-math>\\s-*</disp-formula>"
                        "\n\\\\]\n</P>\n")
  )

(defun search-and-replace-all (sear repl)
  (beginning-of-buffer)
  (while (re-search-forward sear nil t)
    (replace-match repl nil nil))
  )

(defconst src-directory "/home/sorge/git/speech-rule-engine/samples/")

