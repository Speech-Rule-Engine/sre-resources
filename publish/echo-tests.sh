#! /bin/bash

quad='<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mrow><mi>x</mi><mo>=</mo><mfrac><mrow><mo>&#x2212;</mo><mi>b</mi><mo>&#xB1;</mo><msqrt><mrow><msup><mi>b</mi><mn>2</mn></msup><mo>&#x2212;</mo><mn>4</mn><mi>a</mi><mi>c</mi></mrow></msqrt></mrow><mrow><mn>2</mn><mi>a</mi></mrow></mfrac></mrow></math>'
font='<math xmlns="http://www.w3.org/1998/Math/MathML"><mi>&#x1D63C;</mi></math>'
locales="en fr es nemeth"

echo $quad | npx sre
echo $font | npx sre

for loc in $locales; do
    echo $loc
    echo $quad | npx sre -c $loc
    echo $font | npx sre -c $loc
done       
