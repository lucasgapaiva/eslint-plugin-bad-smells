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

## Long method

- **Extract method**: Move code to a separate new method (or function) and replace the old code with a call to the method.

  **Steps:**

  1.  First, create a new method and make sure to name it that the purpose of this method obvious

  2.  Than you are able move the code from the main method to the function created

  3.  The last step is to update the main method with the new methods created

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

  **Benefits**

  - More readable code! Be sure to give the new method a name that describes the method’s purpose: `printDetails()`, `calculateTotalPrice()`, etc.

  - Less code duplication. Often the code that is found in a method can be reused in other places in your program. So you can replace duplicates with calls to your new method.

  - Isolates independent parts of code, meaning that errors are less likely (such as if the wrong variable is modified).

---

<br>

- **Replace Temp with Query**: Move a part of the code to a new separate method and return the result from it.

  **Steps:**

  1.  First, use Extract Method to calculate the value you need in the main method. Make sure that the method only returns a value and does not change the state of the object.

  2.  Replace the variable in the main method.

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

  **Benefits**

  - Code readability. It is much easier to understand the purpose of the method `getTax()` than the line `orderPrice() * 0.2`.

  - Slimmer code via deduplication, if the line being replaced is used in multiple methods.

<br>

---

<br>

## Long Parameter List

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

---

<br>

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

  **Benefits**

  - Instead of a hodgepodge of parameters, you see a single object with a comprehensible name.

  - If the method needs more data from an object, you will not need to rewrite all the places where the method is used – merely inside the method itself.

  **Drawbacks**

  - Sometimes this transformation causes a method to become less flexible: previously the method could get data from many different sources but now, because of refactoring, we are limiting its use to only objects with a particular interface

---

<br>

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

  **Benefits**

  - We get rid of unneeded parameters and simplify method calls. Such parameters are often created not for the project as it is now, but with an eye for future needs that may never come.

  **Drawbacks**

  - You may need the parameter tomorrow for other needs... making you rewrite the method.

<br>

---

<br>

## Long Message Chain

Introduce variable to replace the calls or break the chain into general methods/properties for the object

**Steps**

1. Create a new method and name it in a way that makes its purpose self-evident.

2. Copy the relevant code fragment to your new method. Delete the fragment from its old location and put a call for the new method there instead.

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

```js
//After
function addTreeToEachValue(arr) {
  return arr.map((e) => e + 3);
}

function filterEvenNumbers(arr) {
  return arr.filter((e) => e % 2 === 0);
}

function arrHasNumberTen(arr) {
  return arr.find((e) => e === 10);
}

const arr1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const arr2 = [11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

const arrPlusThree = addTreeToEachValue(arr1);
const evenArr = filterEvenNumbers(arrPlusThree);
const concatArr = evenArr.concat(arr2);
const hasNumberTen = arrHasNumberTen(concatArr);
```

<br>

---

<br>

## Nested Callback

- **Extract method**: Move code to a separate new method (or function) and replace the old code with a call to the method.

  **Steps:**

  1. First, you need to identify the methods you want to remove

  2. Than you are able to move the methods outside the nested calls

  3. The last step is to update the main method with the new methods created

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

<br>

---

<br>

## Empty catch

- Include message errors

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

<br>

# References

- [Source Making](sourcemaking.com)
