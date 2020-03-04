# How to publish a version of SRE

## Crucial tests for the different modes.

### Sync version

  * Usually the normal test is enough.
  
  * Pipeline test could help
  
### Async version

* Test that the package really works 

``` bash
npm publish
npm pack
cp speech-rule-engine-*.tgz /var/www/html/test/
cd /var/www/html/test/
rm -rf node_modules
npm install ./speech-rule-engine-*.tgz
```

*  Test the content of the `pipe-direct.js` file in node.


* Copy the file to tmp execute it with node directly
   
``` bash
cd /special/sorge/test
cp /home/sorge/git/sre/sre-resources/publish/pipe-direct.js .
node pipe-direct.js
```
    
    
### HTTP version

* Test the local version 


### Interactive version
