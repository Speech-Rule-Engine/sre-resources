#! /bin/bash

symbols=en/symbols/

pushd $symbols
# grep key latin-mathfonts*.js latin-upper-normal.js latin-lower-normal.js | awk '{print $1" "$3}'
# grep key greek-mathfonts*.js greek-capital.js greek-small.js | awk '{print $1" "$3}'
grep key math_digits.js | awk '{print $2}'
popd
