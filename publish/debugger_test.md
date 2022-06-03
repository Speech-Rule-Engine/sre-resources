# CLI Tests

Currently these have to be run manually.

## Regular Output

No extra switches.


### Output to Console

Test with input files.

``` shell
./bin/sre -m -p ../sre-resources/samples/quadratic-line.xml
./bin/sre -m -p < ../sre-resources/samples/quadratic-line.xml
cat ../sre-resources/samples/quadratic-line.xml  | ./bin/sre -m -p
```

Manual
``` shell
./bin/sre -m -p
```

### Output to file

Test with input files.

``` shell
./bin/sre -m -o /tmp/out0.txt -p ../sre-resources/samples/quadratic-line.xml
./bin/sre -m -o /tmp/out1.txt -p < ../sre-resources/samples/quadratic-line.xml
cat ../sre-resources/samples/quadratic-line.xml  | ./bin/sre -m  -o /tmp/out2.txt -p
```

Expect no differences.

``` shell
diff3 /tmp/out0.txt  /tmp/out1.txt  /tmp/out2.txt
```

Manual
``` shell
./bin/sre -m -o /tmp/out3.txt -p
```

Multiple files:

``` shell
./bin/sre -m -o /tmp/out4.txt -p ../sre-resources/samples/quadratic-line.xml ../sre-resources/samples/sample1.xml
```


## Debugging Output

This is the `--verbose` or `-v` switch.


### Output to Console

Test with input files.

``` shell
./bin/sre -m -v -p ../sre-resources/samples/quadratic-line.xml
./bin/sre -m -v -p < ../sre-resources/samples/quadratic-line.xml
cat ../sre-resources/samples/quadratic-line.xml  | ./bin/sre -m -v -p
```

Manual
``` shell
./bin/sre -m -v -p
```

### Output to file

Test with input files.

``` shell
./bin/sre -m -o /tmp/out0.txt -v -p ../sre-resources/samples/quadratic-line.xml
./bin/sre -m -o /tmp/out1.txt -v -p < ../sre-resources/samples/quadratic-line.xml
cat ../sre-resources/samples/quadratic-line.xml  | ./bin/sre -m  -o /tmp/out2.txt -v -p
```

Expect no differences

``` shell
diff3 /tmp/out0.txt  /tmp/out1.txt  /tmp/out2.txt
```

Manual
``` shell
./bin/sre -m  -o /tmp/out3.txt -v -p
```

Multiple files:

``` shell
./bin/sre -m -o /tmp/out4.txt -v -p ../sre-resources/samples/quadratic-line.xml ../sre-resources/samples/sample1.xml
```


## Log file

This is the `--verbose` or `-v` switch plus the `--log` or `-l` with a log file.

### Output to Console

Test with input files.

``` shell
./bin/sre -m -v -l /tmp/debug0.txt -p ../sre-resources/samples/quadratic-line.xml
./bin/sre -m -v -l /tmp/debug1.txt -p < ../sre-resources/samples/quadratic-line.xml
cat ../sre-resources/samples/quadratic-line.xml  | ./bin/sre -m -v -l /tmp/debug2.txt -p
```

Expect only timing differences

``` shell
diff3 /tmp/debug0.txt  /tmp/debug1.txt  /tmp/debug2.txt
```

Manual
``` shell
./bin/sre -m -v -l /tmp/debug3.txt -p
```

### Output to file

Test with input files.

``` shell
./bin/sre -m -o /tmp/out0.txt -v -l /tmp/debug0.txt -p ../sre-resources/samples/quadratic-line.xml
./bin/sre -m -o /tmp/out1.txt -v -l /tmp/debug1.txt -p < ../sre-resources/samples/quadratic-line.xml
cat ../sre-resources/samples/quadratic-line.xml  | ./bin/sre -m  -o /tmp/out2.txt -v -l /tmp/debug2.txt -p
```

Expect only timing differences and no differences on output.

``` shell
diff3 /tmp/debug0.txt  /tmp/debug1.txt  /tmp/debug2.txt
diff3 /tmp/out0.txt  /tmp/out1.txt  /tmp/out2.txt
```

Manual
``` shell
./bin/sre -m  -o /tmp/out3.txt -v -l /tmp/debug3.txt -p
```

Multiple files:

``` shell
./bin/sre -m -o /tmp/out4.txt -v -l /tmp/debug4.txt -p ../sre-resources/samples/quadratic-line.xml ../sre-resources/samples/sample1.xml
```
