module.exports = {
  meta: {
    type: "suggestion",

    docs: {
        description: "Try catch statement with empty catch block",
        category: "Possible Errors",
        recommended: true,
        url: "https://github.com/lucas-paiva98/eslint-plugin-bad-smells#empty-catch"
    },
    fixable: "code",
    schema: []
},
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