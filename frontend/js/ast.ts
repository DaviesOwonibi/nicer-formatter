export type NodeType =
  | "Program"
  | "NumericLiteral"
  | "Identifier"
  | "StringLiteral"
  | "BinaryExpr"
  | "CallExpr"
  | "NullExpr"
  | "UnaryExpr"
  | "Declaration"
  | "VariableDeclaration"
  | "ReturnExpr"
  | "ForLoop"
  | "FunctionDeclaration"
  | "FunctionCall"
  | "ObjectDeclaration";

export interface Stmt {
  kind: NodeType;
}

export interface Program extends Stmt {
  kind: "Program";
  body: Stmt[];
}

export interface Expr extends Stmt {}

export interface NullExpr extends Expr {
  kind: "NullExpr";
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
  parens: boolean;
}

export interface ReturnExpr extends Expr {
  kind: "ReturnExpr";
  returnValue: Expr;
  parens: boolean;
}

export interface Identifier extends Expr {
  kind: "Identifier";
  symbol: string;
}

export interface StringLiteral extends Expr {
  kind: "StringLiteral";
  content: string;
  singleQuote: boolean;
}

export interface NumericLiteral extends Expr {
  kind: "NumericLiteral";
  value: number;
}

export interface VariableDeclaration extends Declaration {
  kind: "VariableDeclaration";
  owner: Stmt;
  value: Expr;
  state: number;
}

export interface FunctionDeclaration extends Declaration {
  kind: "FunctionDeclaration";
  name: string;
  body: Stmt[];
  params: Identifier[];
  state: number;
}

export interface ForLoop extends Expr {
  kind: "ForLoop";
  params: Stmt[];
  body: Stmt[];
}

export interface FunctionCall extends Expr {
  kind: "FunctionCall";
  callee: Identifier;
  arguments: Expr[];
}

export interface Property extends Stmt {
  key: Identifier;
  value: Expr;
}

export interface ObjectDeclaration extends Declaration {
  kind: "ObjectDeclaration";
  properties: Property[];
}
