module.exports = {
  meta: {
    type: "suggestion",

    docs: {
        description: "Function with too many parameters",
        category: "Possible Errors",
        recommended: true,
        url: "https://github.com/lucas-paiva98/eslint-plugin-bad-smells#long-parameter-list"
    },
    fixable: "code",
    schema: []
},
  create: function (context) {
    return {
      FunctionDeclaration(node) {
        if (node.params.length > 5) {
          context.report({
            node,
            message: "Functions must have a maximum of 5 parameters",
          });
        }
      }
    }
  }
}