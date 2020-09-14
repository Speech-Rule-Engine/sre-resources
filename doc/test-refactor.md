# Refactoring of the Tests

Goal:

* Light loading via JSON object files.
* Ultimately they should be in Typescript
* Generalisation (see below)





## First step

* Refactor the speech rule tests as they are the largest

### JSON object

* List of tests
* General parts that set the field values: locale, domain, style etc.
* Tests can overwrite those.
* Test has input + expected.

### Loading

* Ultimately it should be done automatically.
* Load each of the locales
* Start with giving the names of the `.json` files

* For each `.json` file we create an object of the `AbstractRuleTest` class or `ClearspeakRuleTest` 
* Maybe we can avoid the latter by generalising the `setup` method.

### Running the runner

* Currently the runner goes through the objects on the prototype and executes every method that starts with `test`.
* We need to run it on the JSON files.

* Loading a json file generates a test object that implements interface `Test`. JSON loading:
    * Each JsonTest object gets the json file name (maybe two for base?)
    * Loads the JSON
    * Prepares the JSON. I.e., fills in it's own fields from the JSON, (like
      name, output file, etc.) and extracts the tests (assembles them from base plus results)
* This object is being registered with the runner.
* Running it will
    * setup (once of every time?)
    * Get the tests list from the object
    * pick from json (which assembles input, expected, arguments) [Is that here on in preparation?]
    * apply test method to input, expected, arguments
    * teardown
    
#### Name 

* We now give each test a name, that is the part behind the test.
* The name can be automatically customised to contain, e.g., the locale etc. 


#### Test flag

* A flag `test` determines if it should be run or not 
* that is in lieu of the `untest` part of the current test names.

#### How do we execute the runner?

* Export a `executeJsonTests` method on `TestRunner`.
* Arguments: name, function, arguments
* name and arguments are from the `json` object. Function is the speech test method, which is the same for all. 

## Converting test automatically

* What do we need for the script?



# Generalising tests

* Load the tests
* Load the expected results (by file or locale)
* Run tests with expected results

## Speech rules

* For the speech rule tests we want a master file with the input
* Each json object from the locale only contains the corresponding expected value.
* Failure is thrown if there is no corresponding object.
* In addition each locale can have some special cases. 
* That is, if I add a new test to the base file, I need to produce the
  corresponding expected for all locales!

## Semantic rules

* Have single input file
* Corresponding output files for enrich, stree
* rebuild should be automatic
