#! /bin/bash

mj=/home/sorge/git/MathJax/MathJax-src/ts/
sre=/home/sorge/git/sre/speech-rule-engine/ts/latex/

mjtree=$mj"core/Tree"
sretree=$sre"core/Tree"

mjmmltree=$mj"core/MmlTree"
sremmltree=$sre"core/MmlTree"

mjmmlnodes=$mj"core/MmlNodes"
sremmlnodes=$sre"core/MmlNodes"

mjparser=$mj"input/tex"
sreparser=$sre"parser"

mjbase=$mj"input/tex/base"
srebase=$sre"parser/base"

mjams=$mj"input/tex/ams"
sreams=$sre"parser/ams"

mjutil=$mj"util"
sreutil=$sre"util"

compare() {
    files=`ls $1/*.ts`
    for file in $files; do
        base=`basename $file`
        echo emacs $file $2/$basename
        diff $file $2/$basename
    done
}

echo MJ TREE
compare $sretree $mjtree
echo
echo MJ MMLTREE
compare $sremmltree $mjmmltree
echo
echo MJ MMLNODES
compare $sremmlnodes $mjmmlnodes
echo
echo MJ PARSER
compare $sreparser $mjparser
echo
echo MJ BASE
compare $srebase $mjbase
echo
echo MJ AMS
compare $sreams $mjams
echo
echo MJ UTIL
compare $sreutil $mjutil
echo

exit 0

ls -R $mjcore
echo SRE CORE
ls -R $srecore

echo MJ PARSER
ls -R $mjparser
echo
echo SRE PARSER
ls -R $sreparser

echo MJ UTIL
ls -R $mjutil
echo
echo SRE UTIL
ls -R $sreutil



# diff $sre$1 $mj$2
