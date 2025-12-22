import { useMemo } from "react";
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import { useAstRules } from "./useAstRules";

export function useComplexityAnalyzer() {
  const { enterRules, exitRules } = useAstRules();

  const estimateTime = (depth, recursion) => {
    if (recursion) return "O(2ⁿ) (recursive)";
    if (depth === 0) return "O(1)";
    if (depth === 1) return "O(n)";
    return `O(n^${depth})`;
  };

  const estimateSpace = (spaceCount) => {
    if (spaceCount === 0) return "O(1)";
    return "O(n)";
  };

  const analyzeCode = useMemo(
    () => (code) => {
      const ast = parse(code, {
        sourceType: "module",
        plugins: ["jsx"],
      });

      const ctx = {
        maxLoopDepth: 0,
        currentDepth: 0,
        spaceCount: 0,
        hasRecursion: false,
        functionStack: [],
      };

      traverse(ast, {
        enter(path) {
          for (const rule of enterRules) {
            if (rule.test(path)) {
              rule.handle(ctx, path);
              // emulate else-if priority: stop at first match
              break;
            }
          }
        },
        exit(path) {
          for (const rule of exitRules) {
            if (rule.test(path)) {
              rule.handle(ctx, path);
              break;
            }
          }
        },
      });

      return {
        time: estimateTime(ctx.maxLoopDepth, ctx.hasRecursion),
        space: estimateSpace(ctx.spaceCount),
      };
    },
    [enterRules, exitRules]
  );

  return { analyzeCode };
}
