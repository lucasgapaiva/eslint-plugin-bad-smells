module.exports = {
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