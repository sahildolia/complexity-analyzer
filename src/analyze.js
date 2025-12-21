import { parse } from "@babel/parser";
import traverse from "@babel/traverse";

export function analyzeCode(code) {
  const ast = parse(code, {
    sourceType: "module",
    plugins: ["jsx"]
  });

  let maxLoopDepth = 0;
  let currentDepth = 0;
  let spaceCount = 0;
  let hasRecursion = false;

  let functionStack = [];

  traverse(ast, {
    enter(path) {
      // Loop detection
      if (
        path.isForStatement() ||
        path.isWhileStatement() ||
        path.isDoWhileStatement()
      ) {
        currentDepth++;
        maxLoopDepth = Math.max(maxLoopDepth, currentDepth);
      }

      // Space detection
      if (
        path.isArrayExpression() ||
        path.isObjectExpression() ||
        path.isNewExpression()
      ) {
        spaceCount++;
      }

      // Function declaration
      if (path.isFunctionDeclaration()) {
        functionStack.push(path.node.id.name);
      }

      // Recursive call detection
      if (path.isCallExpression()) {
        const callee = path.node.callee.name;
        if (functionStack.includes(callee)) {
          hasRecursion = true;
        }
      }
    },

    exit(path) {
      if (
        path.isForStatement() ||
        path.isWhileStatement() ||
        path.isDoWhileStatement()
      ) {
        currentDepth--;
      }

      if (path.isFunctionDeclaration()) {
        functionStack.pop();
      }
    }
  });

  return {
    time: estimateTime(maxLoopDepth, hasRecursion),
    space: estimateSpace(spaceCount)
  };
}

function estimateTime(depth, recursion) {
  if (recursion) return "O(2ⁿ) (recursive)";

  if (depth === 0) return "O(1)";
  if (depth === 1) return "O(n)";
  return `O(n^${depth})`;
}

function estimateSpace(spaceCount) {
  if (spaceCount === 0) return "O(1)";
  return "O(n)";
}
