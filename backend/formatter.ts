import { Expr, Program, Stmt } from "../frontend/ast.ts";

export default function formatAST(ast: Program): string {
  // Initialize formatted code string
  let formattedCode = "";

  function formatNode(node: Expr): string {
    switch (node.kind) {
      case "BinaryExpr":
        return (
          formatNode(node.left) +
          " " +
          node.operator +
          " " +
          formatNode(node.right)
        );
      case "VariableDeclaration":
        const identifier = node.owner;
        return "let " + identifier + " = " + formatNode(node.value);

      case "Identifier":
      case "NumericLiteral":
        return node.symbol || String(node.value); // Handle identifier and numeric literals
      default:
        return "";
    }
  }

  // Traverse the AST and format code
  ast.body.forEach((stmt) => {
    formattedCode += formatNode(stmt) + "\n"; // Add newline after each statement
  });

  return formattedCode;
}
