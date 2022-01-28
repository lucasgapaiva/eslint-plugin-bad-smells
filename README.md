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

- **Long method**: A method contains too many lines of code
- **Long parameter list**: A method contains too many parameters
- **Long message chain**: Long chaining of functions with the dot operator
- **Empty catch**: Catch blocks with zero lines of code
- **Nested callbacks**: A method contains many callbacks

# Refactoring

### Long method

- **Extract method**: Move code to a separate new method (or function) and replace the old code with a call to the method.

  **Steps:**

  1. First, create a new method and make sure to name it that the purpose of this method obvious

  2. Than you are able move the code from the main method to the function created

  3. The last step is to update the main method with the new methods created

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
  function printDetails(amount) {
    console.log("name: " + name);
    console.log("amount: " + amount);
  }

  function printOwing() {
    printBanner();
    printDetails(getOutstanding());
  }
  ```

- **Replace Temp with Query**: Move a part of the code to a new separate method and return the result from it.

  **Steps:**

  1. First, use Extract Method to calculate the value you need in the main method. Make sure that the method only returns a value and does not change the state of the object.

  2. Replace the variable in the main method.

```js
//Before
function calculateTotal() {
  let basePrice = quantity * itemPrice;

  if (basePrice > 1000) return basePrice * 0.95;
  else return basePrice * 0.98;
}
```

```js
//After
function basePrice() {
  return quantity * itemPrice;
}

function calculateTotal() {
  if (basePrice() > 1000) return basePrice() * 0.95;
  else return basePrice() * 0.98;
}
```

### Long Parameter List

- **Extract method**: Move code to a separate new method (or function) and replace the old code with a call to the method.

  **Steps:**

  1. First, you need to identify the parameters that can be grouped

  2. Than you are able to create methods with those parameters

  3. The last step is to update the main method with the new methods created

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
function printAddress(zipCode, address) {
  console.log("zipCode: ", zipCode);
  console.log("address: ", address);
}

function printPersonalData(name, email, number, salary) {
  console.log("name: ", name);
  console.log("email: ", email);
  console.log("number: ", number);
  console.log("salary: ", salary);
}

function printUserData() {
  printAddress(zipCode, address);
  printPersonalData(name, email, number, salary);
}
```

- **Preserve Whole Object**: Instead of passing the values of the object as parameters, you could pass the whole object as a parameter.

  **Steps:**

  1. Instead of destructuring the object, you can preserve the whole object so you know the reference to the properties used in the method.

  2. Now you are able to remove the old parameters from the method and use the object reference.

```js
//Before
const { name, email, number, salary, zipCode, address } = userData;

function printUserData({ name, email, number, salary, zipCode, address }) {
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
function printUserData(userData) {
  console.log("name: ", userData.name);
  console.log("email: ", userData.email);
  console.log("number: ", userData.number);
  console.log("salary: ", userData.salary);
  console.log("zipCode: ", userData.zipCode);
  console.log("address: ", userData.address);
}
```

- **Replace Parameter with Method Call**: Instead of passing the values of the object as parameters, you could pass the whole object as a parameter.

  **Steps:**

  1. Make sure that you don't need the values that are passed to the current method. This is important because it guarantees the code can be moved.

  2. If the code is more complex than a single function, you can use Extract Method to isolate the code and make a simple call.

  3. The next step is to update the main method with all the new functions created to get the values.

  4. After adding the news calls to the method to replace the parameters, you are able to eliminate the parameters from the main method.

```js
//Before
const discount = getDiscount();
const fees = getFees();
const shipping = getShipping();
const hasCupom = getCupom();

function printFinalPrice(
  quantity,
  itemPrice,
  discount,
  fees,
  shipping,
  hasCupom
) {
  // Caculate the final price

  console.log("finalPrice", finalPrice);
}
```

```js
//After
function printFinalPrice(quantity, itemPrice) {
  // Get the values
  const discount = getDiscount();
  const fees = getFees();
  const shipping = getShipping();
  const hasCupom = getCupom();

  // Caculate the final price

  console.log("finalPrice", finalPrice);
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
        document.write(greeting + " " + who)
      })
  })
}, 1000)
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

# References

- [Source Making](sourcemaking.com)
