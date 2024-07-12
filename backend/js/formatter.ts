// deno-lint-ignore-file
import { StringLiteral } from "../../frontend/js/ast.ts";
import { NumericLiteral } from "../../frontend/js/ast.ts";
import { Identifier } from "../../frontend/js/ast.ts";
import { ReturnExpr } from "../../frontend/js/ast.ts";
import {
	BinaryExpr,
	Expr,
	ForLoop,
	FunctionCall,
	FunctionDeclaration,
	ObjectDeclaration,
	Program,
	Stmt,
	VariableDeclaration,
} from "../../frontend/js/ast.ts";

interface rules {
	tabSize?: 2;
	semicolons?: boolean;
	singleQuotes?: boolean;
	newlineBraces?: boolean;
}

export default function formatJsAST(ast: Program, rules: rules): string {
	let formattedCode = "";

	function formatNode(node: Expr): string {
		if (rules.hasOwnProperty("semicolons") && rules["semicolons"] == true) {
			switch (node.kind) {
				case "ObjectDeclaration":
					let objectNewLineBrace: string = " ";
					let objectTabs: string = "";
					if (rules.hasOwnProperty("tabSize") && rules["tabSize"]) {
						const tabSize = rules["tabSize"];
						for (let i = 0; i < tabSize; i++) {
							objectTabs += " ";
						}
					} else {
						objectTabs = "  ";
					}
					if (
						rules.hasOwnProperty("newlineBraces") &&
						rules["newlineBraces"]
					) {
						const newLine: boolean = rules["newlineBraces"];
						if (newLine) {
							objectNewLineBrace = "\n";
						}
					}

					const props = (node as ObjectDeclaration).properties;
					const propertiesFormatted = props
						.map(
							(prop) =>
								`${objectTabs}${prop.key.symbol}: ${formatNode(
									prop.value
								)}`
						)
						.join(",\n");
					return `${objectNewLineBrace}{\n${propertiesFormatted}\n}`;
				case "FunctionCall":
					const callee = (node as FunctionCall).callee.symbol;
					const functionCallParam = (node as FunctionCall).arguments;
					const functionCallParams: string[] = [];
					let functionCallCount = 0;
					functionCallParam.forEach((parameter: Expr) => {
						if (functionCallCount != 0) {
							if (parameter) {
								functionCallParams.push(
									" " + formatNode(parameter)
								);
							} else {
								functionCallParams.push("");
							}
						} else {
							if (parameter) {
								functionCallParams.push(formatNode(parameter));
							} else {
								functionCallParams.push("");
							}
						}
						functionCallCount += 1;
					});

					return `${callee}(${functionCallParams});`;
				case "ForLoop":
					const forBody = (node as ForLoop).body;
					const forParam = (node as ForLoop).params;
					const forBodies: string[] = [];
					const forParams: string[] = [];
					let forNewLineBrace: string = " ";
					let forTabs: string = "";
					if (rules.hasOwnProperty("tabSize") && rules["tabSize"]) {
						const tabSize = rules["tabSize"];
						for (let i = 0; i < tabSize; i++) {
							forTabs += " ";
						}
					} else {
						forTabs = "  ";
					}
					if (
						rules.hasOwnProperty("newlineBraces") &&
						rules["newlineBraces"]
					) {
						const newLine: boolean = rules["newlineBraces"];
						if (newLine) {
							forNewLineBrace = "\n";
						}
					}
					forBody.forEach((stmt: Stmt) => {
						forBodies.push(formatNode(stmt));
					});
					let forCount = 0;
					forParam.forEach((parameter: Expr) => {
						if (forCount != 0) {
							if (forCount == 1) {
								if (parameter) {
									forParams.push(" " + formatNode(parameter));
								} else {
									forParams.push("");
								}
							} else {
								if (parameter) {
									forParams.push(
										" " +
											formatNode(parameter).replace(
												";",
												""
											)
									);
								} else {
									forParams.push("");
								}
							}
						} else {
							if (parameter) {
								if (forParam.length == 1) {
									forParams.push(
										" ; " + formatNode(parameter) + " "
									);
								} else {
									forParams.push(formatNode(parameter));
								}
							} else {
								forParams.push("");
							}
						}
						forCount += 1;
					});
					return (
						`\nfor (${forParams.join("")})${forNewLineBrace}{\n` +
						forBodies
							.map((stmt) => `${forTabs}${stmt}`)
							.join("\n") +
						`\n};\n`
					);
				case "BinaryExpr":
					if ((node as BinaryExpr).parens) {
						return (
							"(" +
							formatNode((node as BinaryExpr).left) +
							" " +
							(node as BinaryExpr).operator +
							" " +
							formatNode((node as BinaryExpr).right) +
							");"
						);
					} else {
						return (
							formatNode((node as BinaryExpr).left) +
							" " +
							(node as BinaryExpr).operator +
							" " +
							formatNode((node as BinaryExpr).right) +
							";"
						);
					}
				case "VariableDeclaration":
					const identifier = (node as VariableDeclaration).owner;
					switch ((node as VariableDeclaration).state) {
						case 0:
							return (
								"let " +
								identifier +
								" = " +
								formatNode(
									(node as VariableDeclaration).value
								) +
								";"
							);
						case 1:
							return (
								"const " +
								identifier +
								" = " +
								formatNode(
									(node as VariableDeclaration).value
								) +
								";"
							);
					}

				case "FunctionDeclaration":
					const name = (node as FunctionDeclaration).name;
					const body = (node as FunctionDeclaration).body;
					const param = (node as FunctionDeclaration).params;
					const bodies: string[] = [];
					const params: string[] = [];
					let tabs: string = "";
					let newLineBrace: string = " ";
					body.forEach((stmt: Stmt) => {
						bodies.push(formatNode(stmt));
					});
					let count = 0;
					param.forEach((parameter: Expr) => {
						if (count != 0) {
							if (parameter) {
								params.push(" " + formatNode(parameter));
							} else {
								params.push("");
							}
						} else {
							if (parameter) {
								params.push(formatNode(parameter));
							} else {
								params.push("");
							}
						}
						count += 1;
					});
					if (rules.hasOwnProperty("tabSize") && rules["tabSize"]) {
						const tabSize = rules["tabSize"];
						for (let i = 0; i < tabSize; i++) {
							tabs += " ";
						}
					} else {
						tabs = "  ";
					}

					if (rules.hasOwnProperty("newlineBraces")) {
						const newLine = rules["newlineBraces"];
						if (newLine) {
							newLineBrace = "\n";
						}
					}
					switch ((node as FunctionDeclaration).state) {
						case 0:
							return (
								`\nfunction ${name}(${params})${newLineBrace}{\n` +
								bodies
									.map((stmt) => `${tabs}${stmt}`)
									.join("\n") +
								`\n};`
							);
						case 1:
							return (
								`\nprivate ${name}(${params}) {\n` +
								bodies
									.map((stmt) => `${tabs}${stmt}`)
									.join("\n") +
								`\n};`
							);
						case 2:
							return (
								`\npublic ${name}(${params}) {\n` +
								bodies
									.map((stmt) => `${tabs}${stmt}`)
									.join("\n") +
								`\n};`
							);
					}

				case "ReturnExpr":
					if ((node as ReturnExpr).parens) {
						return (
							"return (" +
							formatNode((node as ReturnExpr).returnValue) +
							");"
						);
					} else {
						return (
							"return " +
							formatNode((node as ReturnExpr).returnValue)
						);
					}
				case "StringLiteral":
					return '"' + (node as StringLiteral).content + '"';
				case "Identifier":
					return (node as Identifier).symbol;
				case "NumericLiteral":
					return String((node as NumericLiteral).value);
				default:
					return "";
			}
		} else if (
			rules.hasOwnProperty("semicolons") &&
			rules["semicolons"] == false
		) {
			switch (node.kind) {
				case "ForLoop":
					const forBody = (node as ForLoop).body;
					const forParam = (node as ForLoop).params;
					const forBodies: string[] = [];
					const forParams: string[] = [];
					let forNewLineBrace: string = " ";
					let forTabs: string = "";
					if (rules.hasOwnProperty("tabSize") && rules["tabSize"]) {
						const tabSize = rules["tabSize"];
						for (let i = 0; i < tabSize; i++) {
							forTabs += " ";
						}
					} else {
						forTabs = "  ";
					}
					if (rules.hasOwnProperty("newlineBraces")) {
						const newLine = rules["newlineBraces"];
						if (newLine) {
							forNewLineBrace = "\n";
						}
					}
					forBody.forEach((stmt: Stmt) => {
						forBodies.push(formatNode(stmt));
					});
					let forCount = 0;
					forParam.forEach((parameter: Expr) => {
						if (forCount != 0) {
							if (forCount == 1) {
								if (parameter) {
									forParams.push(
										" ;" + formatNode(parameter)
									);
								} else {
									forParams.push("");
								}
							} else {
								if (parameter) {
									forParams.push(
										" ;" + formatNode(parameter)
									);
								} else {
									forParams.push("");
								}
							}
						} else {
							if (parameter) {
								if (forParam.length == 1) {
									forParams.push(
										" ; " + formatNode(parameter) + "; "
									);
								} else {
									forParams.push(formatNode(parameter));
								}
							} else {
								forParams.push("");
							}
						}
						forCount += 1;
					});

					return (
						`\nfor (${forParams.join("")})${forNewLineBrace}{\n` +
						forBodies
							.map((stmt) => `${forTabs}${stmt}`)
							.join("\n") +
						`\n}`
					);
				case "BinaryExpr":
					if ((node as BinaryExpr).parens) {
						return (
							"(" +
							formatNode((node as BinaryExpr).left) +
							" " +
							(node as BinaryExpr).operator +
							" " +
							formatNode((node as BinaryExpr).right) +
							")"
						);
					} else {
						return (
							formatNode((node as BinaryExpr).left) +
							" " +
							(node as BinaryExpr).operator +
							" " +
							formatNode((node as BinaryExpr).right)
						);
					}
				case "VariableDeclaration":
					const identifier = (node as VariableDeclaration).owner;
					switch ((node as VariableDeclaration).state) {
						case 0:
							return (
								"let " +
								identifier +
								" = " +
								formatNode((node as VariableDeclaration).value)
							);
						case 1:
							return (
								"const " +
								identifier +
								" = " +
								formatNode((node as VariableDeclaration).value)
							);
					}

				case "FunctionDeclaration":
					const name = (node as FunctionDeclaration).name;
					const body = (node as FunctionDeclaration).body;
					const param = (node as FunctionDeclaration).params;
					const bodies: string[] = [];
					const params: string[] = [];
					let tabs: string = "";
					let newLineBrace: string = " ";
					body.forEach((stmt: Stmt) => {
						bodies.push(formatNode(stmt));
					});
					let count = 0;
					param.forEach((parameter: Expr) => {
						if (count != 0) {
							if (parameter) {
								params.push(" " + formatNode(parameter));
							} else {
								params.push("");
							}
						} else {
							if (parameter) {
								params.push(formatNode(parameter));
							} else {
								params.push("");
							}
						}
						count += 1;
					});
					if (rules.hasOwnProperty("tabSize") && rules["tabSize"]) {
						const tabSize = rules["tabSize"];
						for (let i = 0; i < tabSize; i++) {
							tabs += " ";
						}
					} else {
						tabs = "  ";
					}

					if (rules.hasOwnProperty("newlineBraces")) {
						const newLine = rules["newlineBraces"];
						if (newLine) {
							newLineBrace = "\n";
						}
					}
					switch ((node as FunctionDeclaration).state) {
						case 0:
							return (
								`\nfunction ${name}(${params})${newLineBrace}{\n` +
								bodies
									.map((stmt) => `${tabs}${stmt}`)
									.join("\n") +
								`\n}`
							);
						case 1:
							return (
								`\nprivate ${name}(${params}) {\n` +
								bodies
									.map((stmt) => `${tabs}${stmt}`)
									.join("\n") +
								`\n}`
							);
						case 2:
							return (
								`\npublic ${name}(${params}) {\n` +
								bodies
									.map((stmt) => `${tabs}${stmt}`)
									.join("\n") +
								`\n}`
							);
					}

				case "ReturnExpr":
					if ((node as ReturnExpr).parens) {
						return (
							"return (" +
							formatNode((node as ReturnExpr).returnValue) +
							")"
						);
					} else {
						return (
							"return " +
							formatNode((node as ReturnExpr).returnValue)
						);
					}
				case "StringLiteral":
					if (
						rules.hasOwnProperty("singleQuotes") &&
						rules["singleQuotes"] == true
					) {
						return "'" + (node as StringLiteral).content + "'";
					} else {
						return '"' + (node as StringLiteral).content + '"';
					}
				case "Identifier":
					return (node as Identifier).symbol;
				case "NumericLiteral":
					return String((node as NumericLiteral).value); // Handle identifier and numeric literals
				default:
					return "";
			}
		}
	}

	ast.body.forEach((stmt) => {
		formattedCode += formatNode(stmt) + "\n";
	});

	return formattedCode;
}
