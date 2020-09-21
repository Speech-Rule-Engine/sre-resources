#! /bin/bash
### Mathspeak rewrite 

name=`basename $1 .js`

cp tmp2 $name.json
cp tmp2 $name-base.json

sed -i '/^\s*"_comment0_": .*$/d' $name-base.json
sed -i '/^\s*"locale": .*$/d' $name-base.json
sed -i '/^\s*"information": .*$/d' $name-base.json
sed -i '/^\s*"exclude": .*$/d' $name-base.json
sed -i '/^\s*"name": .*$/d' $name-base.json
sed -i '/^\s*"active": .*$/d' $name-base.json
sed -i '/^\s*"speech": .*$/d' $name-base.json

sed -i '/^\s*"mathml": .*$/d' $name.json
sed -i '/^\s*"test": .*$/d' $name.json
sed -i '/^\s*"preference": .*$/d' $name.json
sed -i 's/^\(\s*"speech": .*\),$/\1/g' $name.json

