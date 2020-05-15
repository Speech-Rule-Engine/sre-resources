#! /bin/bash

indir=$1
outdir=$2
tmp=`mktemp`
tmp2=`mktemp`

declare -a languages=("cs" "da" "de" "el" "en" "es" "fi" "fr" "is" "it" "ja" "nl" "no" "se" "zh")
# declare -a languages=("en")

extract_currency () {
    grep --no-group-separator -A 1 UIWord $currency | paste -s -d ' \n' > $tmp
    grep currency== $tmp | grep singular | grep -v Less > $tmp2-singular
    grep \' $tmp2-singular | sed s/\'/\"/g | awk -F\" '{print "\""$6"\":\""$(NF-1)"\":\""$(NF-3)"\":\"\""}' > $tmp2
    grep -v \' $tmp2-singular | sed s/currency==/\"/g | sed s/\)/\"/g | awk -F\" '{print "\""$6"\":\""$(NF-1)"\":\""$(NF-3)"\":\"\""}' >> $tmp2
    grep currency== $tmp | grep Less > $tmp2-dual
    grep \' $tmp2-dual | sed s/\'/\"/g | awk -F\" '{print "\""$6"\":\""$(NF-1)"\":\""$(NF-5)"\":\""$(NF-3)"\""}' >> $tmp2
    grep -v \' $tmp2-dual | sed s/currency==/\"/g | sed s/\)/\"/g | awk -F\" '{print "\""$6"\":\""$(NF-1)"\":\""$(NF-5)"\":\""$(NF-3)"\""}' >> $tmp2
    grep currency== $tmp | grep -v connector | grep -v singular | grep -v Less > $tmp2-plural
    grep \' $tmp2-plural | sed s/\'/\"/g | awk -F\" '{print "\""$6"\":\""$(NF-1)"\":\"\":\"\""}' >> $tmp2
    grep -v \' $tmp2-plural | sed s/currency==/\"/g | sed s/\)/\"/g | awk -F\" '{print "\""$6"\":\""$(NF-1)"\":\"\":\"\""}' >> $tmp2
    cp $tmp2 jetzt
    mv $tmp2 $tmp
    
}


output_prefix_json () {
    echo "[" > $prefix
    echo " {" >> $prefix
    echo "  \"locale\":\""$lang"\"" >> $prefix
    echo " }," >> $prefix
    awk -F: '{print " {\n  \"key\": "$1",\n  \"mappings\": {\n    \"default\" : {\n     \"default\": "$2"\n   }\n  }\n },"}' $tmp2-prefix >> $prefix
    sed -i '$ s/.$//' $prefix
    echo "]" >> $prefix

    for i in $lines; do
        echo $i
    done
}


output_unit_json () {
    echo "[" > $out
    echo " {" >> $out
    echo "  \"locale\":\""$lang"\"" >> $out
    echo " }," >> $out
    awk -F: '{print " {\n  \"key\": "$1",\n  \"mappings\": {\n    \"default\" : {\n     \"default\": "$2",\n      \"singular\": "$3",\n      \"dual\": "$4"\n   }\n  }\n },"}' $tmp2 >> $out
    sed -i '$ s/.$//' $out
    echo "]" >> $out

    for i in $lines; do
        echo $i
    done
}


## Sort (and uniq?)
for i in ${languages[@]}; do
    lang=$i
    echo $lang
    currency=$indir/$lang/money.tdl
    mkdir -p $outdir/$lang
    out=$outdir/$lang/currency.json
    extract_currency
    sort $tmp > $tmp2
    output_unit_json
done


# rm $tmp $tmp2 ## pronounce-$lang comma-$lang
