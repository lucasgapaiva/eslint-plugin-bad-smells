module.exports = {
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