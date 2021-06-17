# sre-resources
Resources for the Speech Rule Engine


## Memory debugging

``` bash
node --inspect
```

In Chrome/Brave:

```
chrome://inspect
```

Then open `inspect` and run tests on the console.

Jest problems see here: https://making.close.com/posts/finding-the-cause-of-a-memory-leak-in-jest

``` bash
node --inspect --expose-gc ./node_modules/.bin/jest --runInBand --logHeapUsage js/json/hi/
```
