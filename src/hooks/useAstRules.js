
import { useMemo } from "react";

export function useAstRules() {
  return useMemo(() => {
    const isLoop = (path) =>
      path.isForStatement() ||
      path.isWhileStatement() ||
      path.isDoWhileStatement();

    const enterRules = [
      {
        name: "loop-enter",
        test: isLoop,
        handle: (ctx) => {
          ctx.currentDepth++;
          ctx.maxLoopDepth = Math.max(ctx.maxLoopDepth, ctx.currentDepth);
        },
      },
      {
        name: "allocation",
        test: (path) =>
          path.isArrayExpression() ||
          path.isObjectExpression() ||
          path.isNewExpression(),
        handle: (ctx) => {
          ctx.spaceCount++;
        },
      },
      {
        name: "function-enter",
        test: (path) => path.isFunctionDeclaration(),
        handle: (ctx, path) => {
          const id = path.node.id?.name;
          if (id) ctx.functionStack.push(id);
        },
      },
      {
        name: "recursive-call",
        test: (path) => path.isCallExpression(),
        handle: (ctx, path) => {
          const calleeName = path.node.callee?.name;
          if (calleeName && ctx.functionStack.includes(calleeName)) {
            ctx.hasRecursion = true;
          }
        },
      },
      // default: no-op
    ];

    const exitRules = [
      {
        name: "loop-exit",
        test: isLoop,
        handle: (ctx) => {
          ctx.currentDepth--;
        },
      },
      {
        name: "function-exit",
        test: (path) => path.isFunctionDeclaration(),
        handle: (ctx) => {
          ctx.functionStack.pop();
        },
      },
      // default: no-op
    ];

    return { enterRules, exitRules };
  }, []);
}
``
