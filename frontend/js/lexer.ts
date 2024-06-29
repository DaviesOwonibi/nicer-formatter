export enum TokenType {
	// Data Type
	Number,

	// Operators
	Equals,
	BinaryOperator,

	// Scope separators e.g {} and ()
	OpenParen,
	CloseParen,
	OpenBrace,
	CloseBrace,

	// Keywords
	Let,
	Func,
	Private,
	Public,
	Const,
	Return,
	For,

	// Needed stuff
	Identifier,
	DoubleQuote,
	SingleQuote,
	Semicolon,
	Comma,
	EOF,
}

const KEYWORDS: Record<string, TokenType> = {
	let: TokenType.Let,
	const: TokenType.Const,
	function: TokenType.Func,
	private: TokenType.Private,
	public: TokenType.Public,
	return: TokenType.Return,
	for: TokenType.For,
};

export interface Token {
	value: string;
	type: TokenType;
}

function token(value = "", type: TokenType): Token {
	return { value, type };
}

function isAlpha(src: string): boolean {
	return src.toUpperCase() != src.toLowerCase();
}

function isInt(src: string): boolean {
	const c = src.charCodeAt(0);
	const bound = ["0".charCodeAt(0), "9".charCodeAt(0)];
	return c >= bound[0] && c <= bound[1];
}

function isSkippable(src: string): boolean {
	return (
		src == " " ||
		src == "\n" ||
		src == "\t" ||
		src == "\r" ||
		src == "\v" ||
		src == "\f" ||
		src == ";"
	);
}

export function tokenize(sourceCode: string): Token[] {
	const tokens = new Array<Token>();
	const src = sourceCode.split("");

	while (src.length > 0) {
		if (src[0] == "(") {
			tokens.push(token(src.shift(), TokenType.OpenParen));
		} else if (src[0] == ")") {
			tokens.push(token(src.shift(), TokenType.CloseParen));
		} else if (src[0] == "{") {
			tokens.push(token(src.shift(), TokenType.OpenBrace));
		} else if (src[0] == "}") {
			tokens.push(token(src.shift(), TokenType.CloseBrace));
		} else if (
			src[0] == "+" ||
			src[0] == "-" ||
			src[0] == "*" ||
			src[0] == "/" ||
			src[0] == "%" ||
      src[0] == "<" ||
      src[0] == ">"
		) {
			tokens.push(token(src.shift(), TokenType.BinaryOperator));
		} else if (src[0] == "=") {
			tokens.push(token(src.shift(), TokenType.Equals));
		} else if (src[0] == ",") {
			tokens.push(token(src.shift(), TokenType.Comma));
		} else if (src[0] == '"') {
			tokens.push(token(src.shift(), TokenType.DoubleQuote));
		} else if (src[0] == "'") {
			tokens.push(token(src.shift(), TokenType.SingleQuote));
		} else {
			if (isInt(src[0])) {
				let num = "";
				while (src.length > 0 && isInt(src[0])) {
					num += src.shift();
				}

				tokens.push(token(num, TokenType.Number));
			} else if (isAlpha(src[0])) {
				let identifier = "";

				while (src.length > 0 && isAlpha(src[0])) {
					identifier += src.shift();
				}

				const reserved = KEYWORDS[identifier];

				if (reserved == undefined) {
					tokens.push(token(identifier, TokenType.Identifier));
				} else {
					tokens.push(token(identifier, reserved));
				}
			} else if (isSkippable(src[0])) {
				src.shift();
			} else {
				console.log("Unrecognized character found in code: ", src[0]);
				Deno.exit(1);
			}
		}
	}

	tokens.push({ value: "EndOfFile", type: TokenType.EOF });
	return tokens;
}
