#! /bin/bash
### Mathspeak rewrite 

name=`basename $1 .js`
cp $1 tmp1

sed -i '1,/^$/d' tmp1

sed -i '/^\/\/$/d' tmp1

# sed -i "s/^\/\/\(.*\)$/\"_comment_\": \"\1\",/g" tmp1
count=0
while [ $count -le 100 ]; do
    sed -i "0,/^[[:blank:]]*\/\/\(.*\)$/s//\"_comment$((count))_\": \"\1\",/g" tmp1
    ((count++))
done

sed -i 's/^.*this\.executeRuleTest([a-zA-Z]*,/"speech":/g' tmp1

exit
sed -i '/^[[:blank:]]*\/\/.*$/d' tmp1

sed -i '/^[[:blank:]]*\/\*\*/,/\*\//d;' tmp1 

sed -i '/^.*goog\..*$/d' tmp1

sed -i 's/^.*this\.executeRuleTest([a-zA-Z]*,/"speech":/g' tmp1

sed -i 'N; s/function()\n.*{$/function() {/g' tmp1
sed -i 'N; s/\ =\n\ *function() {$/\ =\ function()\ {/g' tmp1

sed -i 's/^sre\.[A-Za-z]*\.prototype\.\([a-z]*\)\([A-Z].*\)\ =\ function()\ {$/"\2": {\n"test":\ "\1",/g' tmp1

sed -i 's/^[[:blank:]]*var\ \([a-z]*\)\ =\ /"\1":\ /g' tmp1

count=0
while [ $count -le 100 ]; do
    sed -i "0,/^\ *mml\ =\ /s//},\n\"Sample_$((count))\": {\n\"test\": true,\n\"mathml\":\ /g" tmp1
    ((count++))
done

sed -i '0,/};/s//"exclude": [],\n"tests": {/' tmp1

sed -i 's/;$/,/g' tmp1

sed -i 's/sre\.\([a-zA-Z0-9]*\)\ .*$/"name":\ "\1",/g' tmp1

sed -i '/sre\.[A-Za-z]*.*$/d' tmp1

if [ $2 == "en" ]; then
    sed -i "s/.*this\.information\ =/\"locale\":\ \"$2\",\n\"information\":\ /" tmp1
else
    sed -i "s/.*this\.information\ =/\"information\":\ /" tmp1
    sed -i "s/.*this\.locale\ =/\"locale\":\ /" tmp1
    sed -i "s/.*this\.compare\ =/\"compare\":\ /" tmp1
fi

sed -i "s/this.domain\ =/\"domain\":\ /" tmp1

sed -i "s/this.setActive('\(.*\)'),/\"active\":\ \"\1\",/" tmp1

sed -i '0,/^/s//module.exports.tmp\ =\ {/' tmp1

sed -i 's/"test":\ "test"/"test":\ true/g' tmp1

sed -i 's/"test":\ "[a-z]*"/"test":\ false/g' tmp1

sed -i "s/'\(default\|brief\|sbrief\)'),/\n\"preference\":\ \"\1\",/g" tmp1

sed -i "s/mml/mathml/g" tmp1

echo "}}" >> tmp1

# sed -i "s/',/',\n\"speech\":\ /g" tmp1

# sed -i "s/\"speech\":\ \ preference),/\n\"mathml\":/g" tmp1

# sed -i "s/'),/',\n\"mathml\":\ /g" tmp1

cp tmp1 tmp-save

# Emacs to replace stuff
emacs tmp1 -batch -l ~/git/sre/sre-resources/tools/rewrite-tests.el --eval="(rewrite-mml-json-test)" -f save-buffer
# From here on some manipulations.
echo "let fs = require('fs'); fs.writeFileSync('tmp2', JSON.stringify(require('./tmp1').tmp, null, 2));" | node

echo tmp1:
grep speech tmp1  | wc
echo tmp2:
grep speech tmp2  | wc
echo tmp-save:
grep speech tmp-save  | wc

exit
# rm tmp1 tmp2

### Single liners to speed things up!
# for i in *.js; do echo $i; ~/git/sre/sre-resources/tools/test_rewrite.sh $i de; done
# for i in *-base.json; do echo $i;  name=`echo $i| sed s/_english_/_/| sed s/-base//;`; mv $i ../../json/mathspeak/$name; done
# for i in *.json; do name=`echo $i | sed s/_french//`; mv $i ../$name; done
# for i in *.json; do name=`echo $i| sed s/_german_/_/| sed s/-base//;`; echo $i; diff $i ../../json/mathspeak/$name; done > /tmp/out
