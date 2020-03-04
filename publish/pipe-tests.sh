#! /bin/bash

quad='<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mrow><mi>x</mi><mo>=</mo><mfrac><mrow><mo>&#x2212;</mo><mi>b</mi><mo>&#xB1;</mo><msqrt><mrow><msup><mi>b</mi><mn>2</mn></msup><mo>&#x2212;</mo><mn>4</mn><mi>a</mi><mi>c</mi></mrow></msqrt></mrow><mrow><mn>2</mn><mi>a</mi></mrow></mfrac></mrow></math>'
font='<math xmlns="http://www.w3.org/1998/Math/MathML"><mi>&#x1D63C;</mi></math>'
speech="en fr es"
braille="nemeth"

echo $quad | ./bin/sre
echo $font | ./bin/sre

for loc in $speech; do
    echo $loc
    echo $quad | ./bin/sre -c $loc -d mathspeak
    echo $font | ./bin/sre -c $loc -d mathspeak
done       

for loc in $braille; do
    echo $loc
    echo $quad | ./bin/sre -c $loc -d default -b braille
    echo $font | ./bin/sre -c $loc -d default -b braille
done
