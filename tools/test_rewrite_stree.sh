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

sed -i '/^[[:blank:]]*\/\/.*$/d' tmp1

sed -i '/^[[:blank:]]*\/\*\*/,/\*\//d;' tmp1 

sed -i '/^.*goog\..*$/d' tmp1

sed -i "s/^.*this\.executeCharTest('\([^ ]\+\)',\ /\"\1\":\ {\n\"speech\":\ /g" tmp1
sed -i "s/^.*this\.executeCharTest(\"'\",\ /\"'\":\ {\n\"speech\":\ /g" tmp1
sed -i "s/^.*this\.executeCharTest(' ',\ /\"'\":\ {\n\"speech\":\ /g" tmp1
sed -i "s/^.*this\.executeCharTest('\w\+\ \w\+',\ /\"'\":\ {\n\"speech\":\ /g" tmp1
sed -i "s/^.*this\.executeUnitTest('\([^ ]\+\)',\ /\"\1\":\ {\n\"speech\":\ /g" tmp1
sed -i "s/^.*this\.executeUnitTest('\w\+\.\ \w\+\.',\ /\"'\":\ {\n\"speech\":\ /g" tmp1
sed -i "s/^.*this\.executeUnitTest('\w\+\ \w\+',\ /\"'\":\ {\n\"speech\":\ /g" tmp1

sed -i "s/]);/]},/g" tmp1

sed -i 's/^sre\.[A-Za-z]*\.prototype\.\([a-z]*\)\([A-Z].*\)\ =\ function()\ {$/"\2": {\n"test":\ "\1",/g' tmp1

count=0
while [ $count -le 100 ]; do
    sed -i "0,/^\ *mml\ =\ /s//},\n\"Sample_$((count))\": {\n\"test\": true,\n\"mathml\":\ /g" tmp1
    ((count++))
done

sed -i '0,/};/s//"exclude": [],\n"tests": {/' tmp1

sed -i 's/;$/,/g' tmp1

sed -i 's/sre\.\([a-zA-Z0-9]*\)\ .*$/"name":\ "\1",/g' tmp1

sed -i '/sre\.[A-Za-z]*.*$/d' tmp1

sed -i "s/.*this\.information\ =/\"information\":\ /" tmp1
sed -i "s/.*this\.locale\ =/\"locale\":\ /" tmp1
sed -i "s/.*this\.compare\ =/\"compare\":\ /" tmp1

sed -i "s/this.domain\ =/\"domain\":\ /" tmp1

sed -i "s/this.styles\ =/\"styles\":\ /" tmp1

sed -i "s/this.setActive('\(.*\)'),/\"active\":\ \"\1\",/" tmp1

sed -i '0,/^/s//module.exports.tmp\ =\ {/' tmp1

sed -i 's/"test":\ "test",//g' tmp1

sed -i "s/'\(default\|brief\|sbrief\)'),/\n\"preference\":\ \"\1\",/g" tmp1

sed -i 's/^\s*"exclude": .*$/"type":\ "character",/' tmp1

sed -i "s/mml/mathml/g" tmp1

sed -i "s/\"\"\"/\"\\\\\"\"/g" tmp1

echo "}}" >> tmp1

# sed -i "s/',/',\n\"speech\":\ /g" tmp1

# sed -i "s/\"speech\":\ \ preference),/\n\"mathml\":/g" tmp1

# sed -i "s/'),/',\n\"mathml\":\ /g" tmp1

cp tmp1 tmp-save

exit
newname=`echo $name | awk -F_ '{print $1}'`
# From here on some manipulations.
echo "let fs = require('fs');\
     let json = require('./tmp1').tmp;
     let newname = '$newname';
     let name = newname[0].toUpperCase() + newname.slice(1);
     json.information = json.name;
     fs.writeFileSync('tmp2', JSON.stringify(json, null, 2));
     let tests = json.tests;
     delete json.tests;
     let newjson = {};
     Object.assign(newjson, json);
     let chars = tests[name + 'Chars'];
     newjson.tests = chars;
     console.log(newjson);
     fs.writeFileSync(newname + '_characters.json', JSON.stringify(newjson, null, 2));
     chars = tests[name + 'Functions'];
     newjson.tests = chars;
     newjson.type = 'function';
     fs.writeFileSync(newname + '_functions.json', JSON.stringify(newjson, null, 2));
     chars = tests[name + 'Units'];
     newjson.tests = chars;
     newjson.type = 'unit';
     fs.writeFileSync(newname + '_units.json', JSON.stringify(newjson, null, 2));
     " | node

echo tmp1:
grep speech tmp1  | wc
echo tmp2:
grep speech tmp2  | wc
echo tmp-save:
grep speech tmp-save  | wc

echo $name
echo $newname
cp tmp2 ${newname}_characters.json
cp tmp2 ${newname}_functions.json
cp tmp2 ${newname}_units.json

exit 
sed -i 's/^\s*"exclude": .*$/"type":\ "char",/' tmp1
sed -i '/^\s*"domain": .*$/d' tmp1
sed -i '/^\s*"styles": .*$/d' tmp1
sed -i '/^\s*"locale": .*$/d' tmp1
sed -i '/^\s*"information": .*$/d' tmp1
sed -i '/^\s*"name": .*$/d' tmp1
sed -i '/^\s*"active": .*$/d' tmp1
sed -i 's/^\s*"speech": .*$/},/g' tmp1

echo "let fs = require('fs'); fs.writeFileSync('tmp2', JSON.stringify(require('./tmp1').tmp, null, 2));" | node

cp tmp2 $name-base.json
exit
# rm tmp1 tmp2

### Single liners to speed things up!
# for i in *.js; do echo $i; ~/git/sre/sre-resources/tools/test_rewrite.sh $i de; done
# for i in *-base.json; do echo $i;  name=`echo $i| sed s/_english_/_/| sed s/-base//;`; mv $i ../../json/mathspeak/$name; done
# for i in *.json; do name=`echo $i | sed s/_french//`; mv $i ../$name; done
# for i in *.json; do name=`echo $i| sed s/_german_/_/| sed s/-base//;`; echo $i; diff $i ../../json/mathspeak/$name; done > /tmp/out
