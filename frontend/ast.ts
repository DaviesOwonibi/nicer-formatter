export type NodeType =
  | "Program"
  | "NumericLiteral"
  | "Identifier"
  | "BinaryExpr"
  | "CallExpr"
  | "NullExpr"
  | "UnaryExpr"
  | "Declaration"
  | "VariableDeclaration"
  | "FunctionDeclaration";

export interface Stmt {
  kind: NodeType;
}

export interface Program extends Stmt {
  kind: "Program";
  body: Stmt[];
}

export interface Expr extends Stmt {}

export interface NullExpr extends Expr {
  kind: "NullExpr"
}

export interface Declaration extends Stmt {
  owner: Stmt;
  value: Expr;
}

export interface BinaryExpr extends Expr {
  kind: "BinaryExpr";
  left: Expr;
  right: Expr;
  operator: string;
}

export interface Identifier extends Expr {
  kind: "Identifier";
  symbol: string;
}

export interface NumericLiteral extends Expr {
  kind: "NumericLiteral";
  value: number;
}

export interface VariableDeclaration extends Declaration {
  kind: "VariableDeclaration";
  owner: Stmt;
  value: Expr;
}

export interface FunctionDeclaration extends Declaration {
  kind: "FunctionDeclaration";
  name: string;
  params: Stmt[];
  body: Stmt[];
}
