import {
  Stmt,
  Program,
  Expr,
  BinaryExpr,
  NumericLiteral,
  Identifier,
  Declaration,
  VariableDeclaration,
  FunctionDeclaration,
  NullExpr,
} from "./ast.ts";
import { tokenize, Token, TokenType } from "./lexer.ts";

export default class Parser {
  private tokens: Token[] = [];

  private not_eof(): Boolean {
    return this.tokens[0].type != TokenType.EOF;
  }

  private at(): Token {
    return this.tokens[0] as Token;
  }

  private consume(): Token {
    const prev = this.tokens.shift() as Token;
    return prev;
  }

  private expect(type: TokenType): Token {
    const prev = this.tokens.shift();
    if (!prev || prev.type != type) {
      console.error("Expected", TokenType[type]);
      Deno.exit(1);
    }

    return prev;
  }
  private parseVariableDeclaration(): VariableDeclaration {
    this.consume();
    const owner = this.at().value;
    this.consume();
    this.expect(TokenType.Equals); // Consume the "=" operator

    const right = this.parseExpr();

    return {
      kind: "VariableDeclaration",
      owner,
      value: right,
    } as VariableDeclaration;
  }

  private parsePrimaryExpr(): Expr {
    const tk = this.at().type;

    switch (tk) {
      case TokenType.Identifier:
        return {
          kind: "Identifier",
          symbol: this.consume().value,
        } as Identifier;
      case TokenType.Number:
        return {
          kind: "NumericLiteral",
          value: parseFloat(this.consume().value),
        } as NumericLiteral;
      case TokenType.OpenParen:
        this.consume();
        const value = this.parseExpr();
        this.expect(TokenType.CloseParen);
        return value;
      case TokenType.Let:
        // this.expect(TokenType.Identifier);
        const val = this.parseVariableDeclaration();
        return val;
      default:
        console.error("Unexpected token found during parsing: ", this.at());
        return { kind: "NullExpr" } as NullExpr 
        Deno.exit(1);
    }
  }

  private parseMultiplicativeExpr(): Expr {
    let left = this.parsePrimaryExpr();

    while (
      this.at().value == "*" ||
      this.at().value == "/" ||
      this.at().value == "%"
    ) {
      const operator = this.consume().value;
      const right = this.parsePrimaryExpr();
      left = {
        kind: "BinaryExpr",
        left,
        right,
        operator,
      } as BinaryExpr;
    }

    return left;
  }

  private parseAdditiveExpr(): Expr {
    let left = this.parseMultiplicativeExpr();

    while (this.at().value == "+" || this.at().value == "-") {
      const operator = this.consume().value;
      const right = this.parseMultiplicativeExpr();
      left = {
        kind: "BinaryExpr",
        left,
        right,
        operator,
      } as BinaryExpr;
    }

    return left;
  }

  private parseExpr(): Expr {
    return this.parseAdditiveExpr();
  }

  private parseStmt(): Stmt {
    return this.parseExpr();
  }

  public produceAST(sourceCode: string): Program {
    this.tokens = tokenize(sourceCode);
    const program: Program = {
      kind: "Program",
      body: [],
    };

    while (this.not_eof()) {
      program.body.push(this.parseStmt());
    }

    return program;
  }
}
