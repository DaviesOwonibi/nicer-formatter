// deno-lint-ignore-file
import { Expr, Program } from "../frontend/ast.ts";

export default function formatAST(ast: Program, rules: object): string {
	let formattedCode = "";

	function formatNode(node: Expr): string {
		if (rules.hasOwnProperty("semicolons") && rules["semicolons"] == true) {
			if (
				rules.hasOwnProperty("singleQuotes") &&
				rules["singleQuotes"] == false
			) {
				switch (node.kind) {
					case "BinaryExpr":
						if (node.isParens) {
							return (
								"(" +
								formatNode(node.left) +
								" " +
								node.operator +
								" " +
								formatNode(node.right) +
								");"
							);
						} else {
							return (
								formatNode(node.left) +
								" " +
								node.operator +
								" " +
								formatNode(node.right) +
								";"
							);
						}
					case "VariableDeclaration":
						const identifier = node.owner;
						switch (node.state) {
							case 0:
								return (
									"let " +
									identifier +
									" = " +
									formatNode(node.value) +
									";"
								);
							case 1:
								return (
									"const " +
									identifier +
									" = " +
									formatNode(node.value) +
									";"
								);
						}

					case "FunctionDeclaration":
						const name = node.name;
						const body = node.body;
						const param = node.params;
						const bodies: string[] = [];
						const params: string[] = [];
						let tabs: string = "";
						let newLineBrace: string = " ";
						body.forEach((stmt) => {
							bodies.push(formatNode(stmt));
						});
						let count = 0;
						param.forEach((parameter) => {
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
						if (rules.hasOwnProperty("tabSize")) {
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
						switch (node.state) {
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
						if (node.isParens) {
							return (
								"return (" + formatNode(node.returnValue) + ");"
							);
						} else {
							return "return " + formatNode(node.returnValue);
						}
					case "StringLiteral":
						return '"' + node.content + '"';
					case "Identifier":
					case "NumericLiteral":
						return node.symbol || String(node.value); // Handle identifier and numeric literals
					default:
						return "";
				}
			} else if (
				rules.hasOwnProperty("singleQuotes") &&
				rules["singleQuotes"] == true
			) {
				switch (node.kind) {
					case "BinaryExpr":
						if (node.isParens) {
							return (
								"(" +
								formatNode(node.left) +
								" " +
								node.operator +
								" " +
								formatNode(node.right) +
								");"
							);
						} else {
							return (
								formatNode(node.left) +
								" " +
								node.operator +
								" " +
								formatNode(node.right) +
								";"
							);
						}
					case "VariableDeclaration":
						const identifier = node.owner;
						switch (node.state) {
							case 0:
								return (
									"let " +
									identifier +
									" = " +
									formatNode(node.value) +
									";"
								);
							case 1:
								return (
									"const " +
									identifier +
									" = " +
									formatNode(node.value) +
									";"
								);
						}

					case "FunctionDeclaration":
						const name = node.name;
						const body = node.body;
						const param = node.params;
						const bodies: string[] = [];
						const params: string[] = [];
						let tabs: string = "";
						let newLineBrace: string = " ";
						body.forEach((stmt) => {
							bodies.push(formatNode(stmt));
						});
						let count = 0;
						param.forEach((parameter) => {
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
						if (rules.hasOwnProperty("tabSize")) {
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
						switch (node.state) {
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
						if (node.isParens) {
							return (
								"return (" + formatNode(node.returnValue) + ");"
							);
						} else {
							return "return " + formatNode(node.returnValue);
						}
					case "StringLiteral":
						return "'" + node.content + "'";
					case "Identifier":
					case "NumericLiteral":
						return node.symbol || String(node.value); // Handle identifier and numeric literals
					default:
						return "";
				}
			}
		} else if (
			rules.hasOwnProperty("semicolons") &&
			rules["semicolons"] == false
		) {
			switch (node.kind) {
				case "BinaryExpr":
					if (node.isParens) {
						return (
							"(" +
							formatNode(node.left) +
							" " +
							node.operator +
							" " +
							formatNode(node.right) +
							")"
						);
					} else {
						return (
							formatNode(node.left) +
							" " +
							node.operator +
							" " +
							formatNode(node.right)
						);
					}
				case "VariableDeclaration":
					const identifier = node.owner;
					switch (node.state) {
						case 0:
							return (
								"let " +
								identifier +
								" = " +
								formatNode(node.value)
							);
						case 1:
							return (
								"const " +
								identifier +
								" = " +
								formatNode(node.value)
							);
					}

				case "FunctionDeclaration":
					const name = node.name;
					const body = node.body;
					const param = node.params;
					const bodies: string[] = [];
					const params: string[] = [];
					let tabs: string = "";
					let newLineBrace: string = " ";
					body.forEach((stmt) => {
						bodies.push(formatNode(stmt));
					});
					let count = 0;
					param.forEach((parameter) => {
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
					if (rules.hasOwnProperty("tabSize")) {
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
					switch (node.state) {
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
					if (node.isParens) {
						return "return (" + formatNode(node.returnValue) + ")";
					} else {
						return "return " + formatNode(node.returnValue);
					}
				case "Identifier":
				case "NumericLiteral":
					return node.symbol || String(node.value); // Handle identifier and numeric literals
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
