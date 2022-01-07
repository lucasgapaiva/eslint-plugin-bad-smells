# eslint-plugin-bad-smells

[![NPM](https://img.shields.io/npm/v/eslint-plugin-bad-smells.svg)](https://www.npmjs.com/package/eslint-plugin-bad-smells)
[![Downloads](https://img.shields.io/npm/dm/eslint-plugin-bad-smells.svg)](https://www.npmjs.com/package/eslint-plugin-bad-smells)

This plugin looks for bad smells in JavaScript

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-bad-smells`:

```sh
npm install eslint-plugin-bad-smells --save-dev
```

## Usage

Add `bad-smells` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
  "plugins": ["bad-smells"]
}
```

Then configure the rules you want to use under the rules section.

```json
{
  "rules": {
    "bad-smells/empty-catch": "error",
    "bad-smells/long-method": "error",
    "bad-smells/nested-callbacks": "error",
    "bad-smells/long-message-chain": "error",
    "bad-smells/long-parameter-list": "error"
  }
}
```

## Supported Rules

- Long method: A method contains too many lines of code
- Long parameter list: A method contains too many parameters
- Long message chain: Long chaining of functions with the dot operator
- Empty catch: Catch blocks with zero lines of code
- Nested callbacks: A method contains many callbacks

## Refactoring

### Long method

- Extract method: Move code to a separate new method (or function) and replace the old code with a call to the method.

  ```js
  //Before

  function printOwing() {
    printBanner();

    // Print details.
    console.log("name: ", name);
    console.log("amount: ", getAmount());
  }
  ```

  ```js
  //After

  function printOwing() {
    printBanner();
    printDetails(getOutstanding());
  }

  function printDetails(amount) {
    console.log("name: " + name);
    console.log("amount: " + amount);
  }
  ```

### Long Parameter List

- Extract method: Move code to a separate new method (or function) and replace the old code with a call to the method.

  ```js
  //Before

  function printUserData(name, email, number, salary, zipCode, address) {
    console.log("name: ", name);
    console.log("email: ", email);
    console.log("number: ", number);
    console.log("salary: ", salary);
    console.log("zipCode: ", zipCode);
    console.log("address: ", address);
  }
  ```

  ```js
  //After

  function printUserData() {
    printAddress(zipCode, address);
    printPersonalData(name, email, number, salary);
  }

  function printAddress(zipCode, address) {
    console.log("zipCode: ", zipCode);
    console.log("address: ", address);
  }

  function printPersonalData(name, email, number, salary) {
    cconsole.log("name: ", name);
    console.log("email: ", email);
    console.log("number: ", number);
    console.log("salary: ", salary);
  }
  ```

### Long Message Chain

Introduce variable to replace the calls or break the chain into general methods/properties for the object

```js
//Before

const arr1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const arr2 = [11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

const newArr = arr1
  .map((e) => e + 3)
  .filter((e) => e % 2 === 0)
  .concat(arr2)
  .find((e) => e === 10);
```

```js
//After

const arr1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const arr2 = [11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

const arrPlusThree = arr1.map((e) => e + 3);
const evenArr = arrPlusThree.filter((e) => e % 2 === 0);
const concatArr = evenArr.concat(arr2);
const hasNumberTen = evenArr.find((e) => e === 10);
```

### Nested Callback

Extract Method or introduce method variable to replace the call

```js
//Before

setTimeout(function () {
  xhr("/greeting/", function (greeting) {
    xhr("/who/?greeting=" + greeting, function (who) ←֓
      {
        document.write(greeting + " " + who);
      });
  });
}, 1000);
```

```js
//After

setTimeout(foo, 1000);

function foo() {
  xhr("/greeting/", bar);
}

function bar(greeting) {
  xhr("/who/?greeting=" + greeting, baz);
}

function baz(who) {
  document.write(greeting + " " + who);
}
```

### Empty catch

Include message errors

```js
//Before

try {
  await asyncCall();
} catch (error) {}
```

```js
//After

try {
  await asyncCall();
} catch (error) {
  console.error(error);
}
```
