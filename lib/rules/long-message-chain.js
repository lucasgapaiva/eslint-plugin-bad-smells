module.exports = {
  meta: {
    type: "suggestion",

    docs: {
        description: "Too many chained functions",
        category: "Possible Errors",
        recommended: true,
        url: "https://github.com/lucas-paiva98/eslint-plugin-bad-smells#long-message-chain"
    },
    fixable: "code",
    schema: []
  },
  create: function (context) {
    return {
      "CallExpression:exit"(node) {
        function skipChainExpression(node) {
          return node && node.type === "ChainExpression" ? node.expression : node;
        }

        const callee = skipChainExpression(node.callee);

        if (callee.type !== "MemberExpression") {
          return;
        }

        let parent = skipChainExpression(callee.object);
        let depth = 1;

        while (parent && parent.callee) {
          depth += 1;
          parent = skipChainExpression(skipChainExpression(parent.callee).object);
        }

        if (depth > 3) {
          context.report({
            node,
            message: "You must chain a maximum of 3 functions"
          });
        }
      }
    }
  }
}