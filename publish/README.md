# How to publish a version of SRE

1. Run crucial tests.
2. Keep tests in sync.
3. Version bump.
4. Publish
5. Tag release: speech-rule-engine and sre-tests

## Crucial tests for the different modes.

### Sync version

* Transpile the files in `speech-rule-engine`

``` bash
npx tsc; npx webpack; make publish
```

_Note, that `make publish` is temporary until we have a different method to generate locales._

* Run the usually test suite in `sre-tests`

``` bash
npm run test
```

* Run a pipeline test in the sre directory. For example:

``` bash
cat ../sre-resources/samples/quadratic-line.xml | ./bin/sre -d mathspeak
cat ../sre-resources/samples/quadratic-line.xml | ./bin/sre -d clearspeak
cat ../sre-resources/samples/quadratic-line.xml | ./bin/sre -d mathspeak -c fr
cat ../sre-resources/samples/quadratic-line.xml | ./bin/sre -d clearspeak -c fr
```

  
### Async version

* Make a fresh install in tmp

``` bash
cd /tmp
rm -rf node_modules speech-rule-engine
git clone git@github.com:zorkow/speech-rule-engine.git
cd speech-rule-engine
git checkout typescript
npm install
```

_Checking out typescript is temporary!_

* Test that the package really works 

``` bash
npm run prepublishOnly
npm pack
rm -rf /var/www/html/test/*
cp speech-rule-engine-*.tgz /var/www/html/test/
cd /var/www/html/test/
rm -rf node_modules
npm install ./speech-rule-engine-*.tgz
```

* Test the content of the `pipe-direct.js` file in node.
* Copy the file to tmp execute it with node directly
   
``` bash
cd /var/www/html/test
cp /home/sorge/git/sre/sre-resources/publish/pipe-direct.js .
node pipe-direct.js
```
    
    
### HTTP version

Test the various HTML versions:

* Local: version from the local git client. 

``` bash
browser_local.html
```
Make sure you have built `sre_browser.js` and run it on localhost.


* Test: version from the test package installed as in the previous section.

``` bash
browser_test.html
```

Run on localhost.

* Local sre with online math maps library that are available at
  `cdn.jsdelivr.net/npm/speech-rule-engine`.

``` bash
browser_libs.html
```

__This test is run before bumping the version number!__

* Online: the latest version available on `cdn.jsdelivr.net/npm/speech-rule-engine`.

``` bash
browser_online.html
```

__This test is run after the actual release!__

## Keeping the tests in sync

After running and passing the tests locally, make sure to commit the latest
version of the submodule before making a version bump.

``` bash
git submodule update --remote --merge
```

## Version upgrade

Make sure to upgrade version in 

* `src/common/variables`
* `package.json`

Run `npm install`. This should upgrade the version in 
* `package-lock.json` 
as well


## Publish a Release


``` bash
cd /tmp
rm -rf node_modules speech-rule-engine
git clone git@github.com:zorkow/speech-rule-engine.git
cd speech-rule-engine
npm install
npm publish
```

## Tag releases

Make sure to use tags to keep releases and tests in sync. (This only starts
since v3.2.0-beta.1). We create annotated tags for all major, minor and point
releases!


### Tag SRE

``` bash
version=`npm view speech-rule-engine version`
git tag -a v$version -m "Release type $version"
git push origin v$version
```

Alternatively generate a tag when making release on github.

### Tag the tests

``` bash
version=`npm view speech-rule-engine version`
git tag -a v$version -m "Tests for SRE release v$version"
git push origin v$version
```


# Overview of different ways to call SRE

* Browser Version: `sre_browser.js`
* Node Version: `sre.js`. This is used by all node based applications going through the exported API:
    * CLI based in repository: Start by `bin/sre`
    * CLI based in npm package: Start by `bin/sre`
    * Require based from npm package: Loads `index.js`
* Interactive: Loaded via `lib/sre4node`

Main difference is that for browser and interactive loading you have the full
library available, not only the exported API.

The following is part of a systematic failure analysis when loading the
Mathspeak rule set.

## Analysing failure on English Mathspeak:

### SRE in Browser 

__Succeeds__

Running in browser:

``` bash
browser_local.html
```

``` bash
browser_test.html
```


## CLI based in repository

__Succeeds__

Five different calls:

* Pipes 

``` bash
cat ../sre-resources/samples/quadratic-line.xml | ./bin/sre -d mathspeak
```

``` bash
echo '<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mrow><mi>x</mi><mo>=</mo><mfrac><mrow><mo>&#x2212;</mo><mi>b</mi><mo>&#xB1;</mo><msqrt><mrow><msup><mi>b</mi><mn>2</mn></msup><mo>&#x2212;</mo><mn>4</mn><mi>a</mi><mi>c</mi></mrow></msqrt></mrow><mrow><mn>2</mn><mi>a</mi></mrow></mfrac></mrow></math>' | ./bin/sre -d mathspeak
```

``` bash
./bin/sre -d mathspeak < ../sre-resources/samples/quadratic-line.xml
```

* File input

``` bash
./bin/sre -d mathspeak -i ../sre-resources/samples/quadratic-line.xml
```

* Input from stdin

``` bash
./bin/sre -d mathspeak
<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mrow><mi>x</mi><mo>=</mo><mfrac><mrow><mo>&#x2212;</mo><mi>b</mi><mo>&#xB1;</mo><msqrt><mrow><msup><mi>b</mi><mn>2</mn></msup><mo>&#x2212;</mo><mn>4</mn><mi>a</mi><mi>c</mi></mrow></msqrt></mrow><mrow><mn>2</mn><mi>a</mi></mrow></mfrac></mrow></math>
```

### CLI in npm package

__Succeeds__

Calls similar to previous ones with exception of using `npx sre -d mathspeak`.


### Require of npm package

__Fails__

* Example is the `pipe-direct.js` test. 
* Alternative calls commands:

``` javascript
sre = require('speech-rule-engine');
sre.setupEngine({domain: 'mathspeak'});
sre.toSpeech('<math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><mrow><mi>x</mi><mo>=</mo><mfrac><mrow><mo>&#x2212;</mo><mi>b</mi><mo>&#xB1;</mo><msqrt><mrow><msup><mi>b</mi><mn>2</mn></msup><mo>&#x2212;</mo><mn>4</mn><mi>a</mi><mi>c</mi></mrow></msqrt></mrow><mrow><mn>2</mn><mi>a</mi></mrow></mfrac></mrow></math>');
```

``` javascript
sre = require('speech-rule-engine');
sre.setupEngine({domain: 'mathspeak'});
sre.file.toSpeech('/home/sorge/git/sre/sre-resources/samples/quadratic-line.xml');
```

``` bash
echo "sre = require('speech-rule-engine');sre.setupEngine({domain: 'mathspeak'});console.log(sre.toSpeech('<math><mrow><mi>x</mi><mo>=</mo><mfrac><mrow><mo>&#x2212;</mo><mi>b</mi><mo>&#xB1;</mo><msqrt><mrow><msup><mi>b</mi><mn>2</mn></msup><mo>&#x2212;</mo><mn>4</mn><mi>a</mi><mi>c</mi></mrow></msqrt></mrow><mrow><mn>2</mn><mi>a</mi></mrow></mfrac></mrow></math>'));" | node
```

### Interactive SRE

__Fails__

``` javascript
require('/home/sorge/git/sre/speech-rule-engine/lib/sre4node');
sre.System.getInstance().setupEngine({domain: 'mathspeak'});
sre.System.getInstance().toSpeech('<math><mrow><mi>x</mi><mo>=</mo><mfrac><mrow><mo>&#x2212;</mo><mi>b</mi><mo>&#xB1;</mo><msqrt><mrow><msup><mi>b</mi><mn>2</mn></msup><mo>&#x2212;</mo><mn>4</mn><mi>a</mi><mi>c</mi></mrow></msqrt></mrow><mrow><mn>2</mn><mi>a</mi></mrow></mfrac></mrow></math>');
```

``` javascript
sre.ProcessorFactory.process('speech', '<math><mrow><mi>x</mi><mo>=</mo><mfrac><mrow><mo>&#x2212;</mo><mi>b</mi><mo>&#xB1;</mo><msqrt><mrow><msup><mi>b</mi><mn>2</mn></msup><mo>&#x2212;</mo><mn>4</mn><mi>a</mi><mi>c</mi></mrow></msqrt></mrow><mrow><mn>2</mn><mi>a</mi></mrow></mfrac></mrow></math>')
```

## Analysing call sequence

### CLI (Engine mode: Sync)

``` javascript
sre.Cli.getInstance().runProcessors()
sre.ProcessorFactory.output();
sre.Processor('speech').processor
```

File handling goes via 

``` javascript
sre.Cli.getInstance().execute()
```


### Browser (Engine mode: HTTP)

Either goes through the 

### Interactive or Require (Engine mode: Async)

``` javascript
sre.System.getInstance().toSpeech();
sre.System.getInstance().processString();
sre.ProcessorFactory.process();
sre.Processor('speech').processor
```




