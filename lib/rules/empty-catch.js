module.exports = {
  create: function (context) {
    return {
      BlockStatement(node) {

        if (node.body.length !== 0) {
          return;
        }

        context.report({
          node,
          message: "Catch blocks must not be empty"
        });
      },
    };
  }
}