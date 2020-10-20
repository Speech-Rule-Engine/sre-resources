#! /bin/bash
### Mathspeak rewrite 

rules=output
name=`basename $1 .js`

# name=`echo $name | sed "s/_\(english\|spanish\|german\|french\)//"`
echo $name
cp $2 $name.json
cp $2 $name-base.json

sed -i '/^\s*"_comment0_": .*$/d' $name-base.json
sed -i '/^\s*"locale": .*$/d' $name-base.json
sed -i '/^\s*"information": .*$/d' $name-base.json
sed -i '/^\s*"exclude": .*$/d' $name-base.json
sed -i '/^\s*"name": .*$/d' $name-base.json
sed -i '/^\s*"active": .*$/d' $name-base.json
sed -i '/^\s*"expected": .*$/d' $name-base.json

sed -i '/^\s*"input": .*$/d' $name.json
sed -i '/^\s*"id": .*$/d' $name.json
sed -i '/^\s*"test": .*$/d' $name.json
sed -i "s/^\(\s*\)\(\"information\":\)/\1\"base\":\ \"json\/$rules\/$name.json\",\n\1\2/" $name.json
sed -i '/^\s*"preference": .*$/d' $name.json
sed -i 's/^\(\s*"expected": .*\),$/\1/g' $name.json

# cp $name-base.json ../../json/$rules/$name.json
cp $name.json $rules/
cp $name-base.json $rules/
