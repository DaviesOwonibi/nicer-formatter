// deno-lint-ignore-file no-case-declarations
import {
  Stmt,
  Program,
  Expr,
  BinaryExpr,
  NumericLiteral,
  Identifier,
  VariableDeclaration,
  FunctionDeclaration,
  NullExpr,
  ReturnExpr,
  StringLiteral,
  ForLoop,
  FunctionCall,
  ObjectDeclaration,
  Property,
} from "./ast.ts";
import { tokenize, Token, TokenType } from "./lexer.ts";

export default class Parser {
  private tokens: Token[] = [];

  private not_eof(): boolean {
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

  private parseForLoop(): ForLoop {
    this.consume();
    this.expect(TokenType.OpenParen);
    const params: Expr[] = [];
    while (this.at().type != TokenType.CloseParen) {
      params.push(this.parseExpr(false));

      if (this.at().type == TokenType.CloseParen) {
        break;
      }
    }

    this.consume();
    this.expect(TokenType.OpenBrace);
    const body: Stmt[] = [];
    while (this.at().type != TokenType.CloseBrace && this.not_eof()) {
      body.push(this.parseStmt(false)); // Allow parsing statements within braces
    }
    this.expect(TokenType.CloseBrace);
    return {
      kind: "ForLoop",
      params: params,
      body: body,
    } as ForLoop;
  }

  private parseString(singleQuotes: boolean): StringLiteral {
    const content = this.consume().value;

    return {
      kind: "StringLiteral",
      content: content,
      singleQuote: singleQuotes,
    } as StringLiteral;
  }

  private parseFunctionDeclaration(state: number): FunctionDeclaration {
    this.consume();
    const name = this.at().value;
    this.consume();
    this.expect(TokenType.OpenParen);
    const params: Identifier[] = [];
    while (this.at().type != TokenType.CloseParen) {
      if (this.at().type == TokenType.Comma) {
        this.consume();
      } else {
        params.push(this.parseIdentifier());
      }

      if (this.at().type == TokenType.CloseParen) {
        break;
      }
    }
    this.consume();
    this.expect(TokenType.OpenBrace);
    const body: Stmt[] = [];
    while (this.at().type != TokenType.CloseBrace && this.not_eof()) {
      body.push(this.parseStmt(false)); // Allow parsing statements within braces
    }
    this.expect(TokenType.CloseBrace);

    return {
      kind: "FunctionDeclaration",
      name: name,
      body: body,
      state: state,
      params: params,
    } as unknown as FunctionDeclaration;
  }

  private parseVariableDeclaration(state: number): VariableDeclaration {
    this.consume();
    const owner = this.at().value;
    this.consume();
    this.expect(TokenType.Equals);
    const isParens = false;

    const value =
      this.at().type === TokenType.OpenBrace
        ? this.parseObjectLiteral()
        : this.parseAdditiveExpr(isParens);

    return {
      kind: "VariableDeclaration",
      owner: owner,
      value: value,
      state: state,
    } as unknown as VariableDeclaration;
  }

  private parsePrimaryExpr(): Expr {
    const tk = this.at().type;

    switch (tk) {
      case TokenType.Identifier:
        return this.parseIdentifierOrCall();
      case TokenType.Number:
        return {
          kind: "NumericLiteral",
          value: parseFloat(this.consume().value),
        } as NumericLiteral;
      case TokenType.OpenParen:
        this.consume();
        const value = this.parseExpr(true);
        this.expect(TokenType.CloseParen);
        return value;
      case TokenType.DoubleQuote:
        this.consume();
        const doubleStringValue = this.parseString(false);
        this.expect(TokenType.DoubleQuote);
        return doubleStringValue;
      case TokenType.SingleQuote:
        this.consume();
        const singleStringValue = this.parseString(true);
        this.expect(TokenType.SingleQuote);
        return singleStringValue;
      case TokenType.Let:
        const letValue = this.parseVariableDeclaration(0);
        return letValue;
      case TokenType.Const:
        const constValue = this.parseVariableDeclaration(1);
        return constValue;
      case TokenType.Func:
        const func = this.parseFunctionDeclaration(0);
        return func;
      case TokenType.Private:
        const privateFunction = this.parseFunctionDeclaration(1);
        return privateFunction;
      case TokenType.Public:
        const publicFunction = this.parseFunctionDeclaration(2);
        return publicFunction;
      case TokenType.Return:
        const retVal = this.parseReturnExpr(false);
        return retVal;
      case TokenType.For:
        const forVal = this.parseForLoop();
        return forVal;
      case TokenType.OpenBrace:
        return this.parseObjectLiteral();
      default:
        console.error("Unexpected token found during parsing: ", this.at());
        return { kind: "NullExpr" } as NullExpr;
    }
  }

  private parseIdentifierOrCall(): Expr {
    let expr: Expr = this.parseIdentifier();
    while (
      this.at().type === TokenType.Dot ||
      this.at().type === TokenType.OpenParen
    ) {
      if (this.at().type === TokenType.Dot) {
        this.consume(); // consume the dot
        const property = this.parseIdentifier();
        expr = {
          kind: "Identifier",
          symbol: `${(expr as Identifier).symbol}.${(property as Identifier).symbol}`,
        } as Identifier;
      } else if (this.at().type === TokenType.OpenParen) {
        expr = this.parseFunctionCall(expr as Identifier);
      }
    }
    return expr;
  }

  private parseIdentifier(): Identifier {
    return {
      kind: "Identifier",
      symbol: this.consume().value,
    } as Identifier;
  }

  private parseFunctionCall(callee: Identifier): FunctionCall {
    this.consume(); // Consume the open parenthesis
    const args: Expr[] = [];
    while (this.at().type !== TokenType.CloseParen) {
      args.push(this.parseExpr(false));
      if (this.at().type === TokenType.Comma) {
        this.consume(); // Consume the comma
      }
    }
    this.expect(TokenType.CloseParen); // Consume the close parenthesis

    return {
      kind: "FunctionCall",
      callee: callee,
      arguments: args,
    } as unknown as FunctionCall;
  }

  private parseObjectLiteral(): ObjectDeclaration {
    this.consume(); // Consume the open brace
    const properties: Property[] = [];
    while (this.at().type !== TokenType.CloseBrace) {
      const key = this.parseIdentifier();
      this.expect(TokenType.Colon);
      const value = this.parseExpr(false);
      properties.push({ key, value } as Property);
      if (this.at().type === TokenType.Comma) {
        this.consume(); // Consume the comma
      }
    }
    this.expect(TokenType.CloseBrace); // Consume the close brace

    return {
      kind: "ObjectDeclaration",
      properties: properties,
    } as ObjectDeclaration;
  }

  private parseMultiplicativeExpr(isParens: boolean): Expr {
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
        parens: isParens,
      } as BinaryExpr;
    }

    return left;
  }

  private parseAdditiveExpr(isParens: boolean): Expr {
    let left = this.parseMultiplicativeExpr(isParens);

    while (
      this.at().value == "+" ||
      this.at().value == "-" ||
      this.at().value == "<" ||
      this.at().value == ">"
    ) {
      const operator = this.consume().value;
      const right = this.parseMultiplicativeExpr(isParens);
      left = {
        kind: "BinaryExpr",
        left,
        right,
        operator,
        parens: isParens,
      } as BinaryExpr;
    }

    return left;
  }

  private parseReturnExpr(isParens: boolean): Expr {
    this.consume();
    const retValue = this.parseExpr(isParens);

    return {
      kind: "ReturnExpr",
      returnValue: retValue,
      parens: isParens,
    } as ReturnExpr;
  }

  private parseExpr(isParens: boolean): Expr {
    return this.parseAdditiveExpr(isParens);
  }

  private parseStmt(isParens: boolean): Stmt {
    return this.parseExpr(isParens);
  }

  public produceAST(sourceCode: string): Program {
    this.tokens = tokenize(sourceCode);
    const program: Program = {
      kind: "Program",
      body: [],
    };

    while (this.not_eof()) {
      program.body.push(this.parseStmt(false));
    }

    return program;
  }
}
