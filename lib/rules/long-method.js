module.exports = {
  meta: {
    type: "suggestion",

    docs: {
        description: "Function with too many lines",
        category: "Possible Errors",
        recommended: true,
        url: "https://github.com/lucas-paiva98/eslint-plugin-bad-smells#long-method"
    },
    fixable: "code",
    schema: []
  },
  create: function (context) {  
    return {
      FunctionDeclaration(node) {
        const { loc } = node;

        const linesOfCode = loc.end.line - loc.start.line;

        if (linesOfCode > 50) {
          context.report({
            node,
            message: "Functions must have a maximum of 50 lines"
          });
        }
      }
    }
  }
}