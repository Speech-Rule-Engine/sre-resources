#! /bin/bash

name=`basename $1 .js`
cp $1 tmp1

sed -i '1,/^$/d' tmp1

sed -i '/^\/\/$/d' tmp1

# sed -i "s/^\/\/\(.*\)$/\"_comment_\": \"\1\",/g" tmp1
count=0
while [ $count -le 10 ]; do
    sed -i "0,/^\/\/\(.*\)$/s//\"_comment$((count))_\": \"\1\",/g" tmp1
    ((count++))
done


sed -i '/\/\*\*/,/\*\//d;' tmp1 

sed -i '/^.*goog\..*$/d' tmp1

sed -i '/^.*this\.executeRuleTest.*$/d' tmp1

sed -i 's/^sre\.Clearspeak.*\.prototype\.\([a-z]*\)\([A-Z].*\)\ =\ function()\ {$/"\2": {\n"name": "\2",\n"test":\ "\1",/g' tmp1

sed -i 's/^.*var\ \([a-z]*\)\ =\ /"\1":\ /g' tmp1

sed -i '0,/};/s//"tests": {/' tmp1

sed -i 's/;$/,/g' tmp1

sed -i 's/sre\.Clearspeak\([a-zA-Z0-9]*\)\ .*$/"name":\ "\1",/g' tmp1

sed -i '/sre\.Clearspeak.*$/d' tmp1

sed -i 's/.*this\.information\ =/"information":\ /' tmp1

sed -i '0,/^/s//module.exports.tmp\ =\ {/' tmp1

sed -i 's/"test":\ "test"/"test":\ true/g' tmp1

sed -i 's/"test":\ "[a-z]*"/"test":\ false/g' tmp1

echo "}}" >> tmp1

echo "let fs = require('fs'); fs.writeFileSync('tmp2', JSON.stringify(require('./tmp1').tmp, null, 2));" | node

cp tmp2 $name.json
rm tmp1 tmp2
