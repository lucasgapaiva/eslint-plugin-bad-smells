module.exports = {
  meta: {
    type: "suggestion",

    docs: {
        description: "Function with too many callbacks",
        category: "Possible Errors",
        recommended: true,
        url: "https://github.com/lucas-paiva98/eslint-plugin-bad-smells#nested-callbacks"
    },
    fixable: "code",
    schema: []
},
  create: function (context) {
    const callbackStack = [];

    function checkFunction(node) {
      const parent = node.parent;

      if (parent.type === "CallExpression") {
        callbackStack.push(node);
      }

      if (callbackStack.length > 3) {
        context.report({
          node,
          message: "Functions must have a maximum of 3 callbacks"
        });
      }
    }

    function popStack() {
      callbackStack.pop();
    }

    return {
      ArrowFunctionExpression: checkFunction,
      "ArrowFunctionExpression:exit": popStack,

      FunctionExpression: checkFunction,
      "FunctionExpression:exit": popStack
    };

  }
}