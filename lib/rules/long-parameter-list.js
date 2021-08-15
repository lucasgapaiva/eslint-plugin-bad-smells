module.exports = {
  create: function (context) {
    return {
      FunctionDeclaration(node) {
        if (node.params.length > 5) {
          context.report({
            node,
            message: "Functions must have a maximum of 5 parameters"
          });
        }
      }
    }
  }
}