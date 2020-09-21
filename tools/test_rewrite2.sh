#! /bin/bash
### Clearspeak issues rewrite 

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

sed -i '/^[[:blank:]]*\/\/.*$/d' tmp1

sed -i '/^[[:blank:]]*\/\*\*/,/\*\//d;' tmp1 

sed -i '/^.*goog\..*$/d' tmp1

sed -i '/^.*this\.executeRuleTest.*$/d' tmp1

sed -i 's/^sre\.Clearspeak.*\.prototype\.\([a-z]*\)\([A-Z].*\)\ =\ function()\ {$/"\2": {\n"test":\ "\1",/g' tmp1

sed -i 's/^[[:blank:]]*var\ \([a-z]*\)\ =\ /"\1":\ /g' tmp1

sed -i '0,/};/s//"exclude": [],\n"tests": {/' tmp1

sed -i 's/;$/,/g' tmp1

sed -i 's/sre\.Clearspeak\([a-zA-Z0-9]*\)\ .*$/"name":\ "\1",/g' tmp1

sed -i '/sre\.Clearspeak.*$/d' tmp1

sed -i "s/.*this\.information\ =/\"locale\": \"$2\",\n\"information\":\ /" tmp1

sed -i '0,/^/s//module.exports.tmp\ =\ {/' tmp1

sed -i 's/"test":\ "test"/"test":\ true/g' tmp1

sed -i 's/"test":\ "[a-z]*"/"test":\ false/g' tmp1

echo "}}" >> tmp1

sed -i "s/',/',\n\"speech\":\ /g" tmp1

sed -i "s/\"speech\":\ \ preference),/\n\"mathml\":/g" tmp1

sed -i "s/'),/',\n\"mathml\":\ /g" tmp1

exit

# From here on some manipulations.
echo "let fs = require('fs'); fs.writeFileSync('tmp2', JSON.stringify(require('./tmp1').tmp, null, 2));" | node

cp tmp2 $name.json
cp tmp2 $name-base.json

sed -i '/^\s*"_comment0_": .*$/d' $name-base.json
sed -i '/^\s*"locale": .*$/d' $name-base.json
sed -i '/^\s*"information": .*$/d' $name-base.json
sed -i '/^\s*"exclude": .*$/d' $name-base.json
sed -i '/^\s*"name": .*$/d' $name-base.json
sed -i '/^\s*"speech": .*$/d' $name-base.json
sed -i 's/^\(\s*"mathml": .*\),$/\1/g' $name-base.json

sed -i '/^\s*"mathml": .*$/d' $name.json
sed -i '/^\s*"test": .*$/d' $name.json
sed -i '/^\s*"preference": .*$/d' $name.json

# rm tmp1 tmp2

### Single liners to speech things up!
# for i in *.js; do echo $i; ~/git/sre/sre-resources/tools/test_rewrite.sh $i de; done
# for i in *-base.json; do echo $i;  name=`echo $i| sed s/_english_/_/| sed s/-base//;`; mv $i ../../src/$name; done
# for i in *.json; do name=`echo $i | sed s/_german//`; mv $i ../$name; done
# for i in *.json; do name=`echo $i| sed s/_german_/_/| sed s/-base//;`; echo $i; diff $i ../../src/$name; done > /tmp/out
