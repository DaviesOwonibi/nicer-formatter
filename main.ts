import Parser from "./frontend/parser.ts";
import formatAST from "./backend/formatter.ts";

async function getJson(filePath: string) {
	try {
		return JSON.parse(await Deno.readTextFile(filePath));
	} catch (e) {
		if (e.message.includes("os error 2")) {
			const configOptions = `{\n  "tabSize": 2,\n  "semicolons": true,\n  "singleQuotes": false,\n  "newlineBraces": false\n}`;
			await Deno.create("./.nicerrc");
			await Deno.writeTextFile("./.nicerrc", configOptions);
			return await getJson("./.nicerrc");
		} else {
			throw e;
		}
	}
}

const args = Deno.args;
const file = args[0];

if (args.length !== 1) {
	console.error("Usage: nice file.js or file.ts");
	Deno.exit(1);
}

const validExtensions = [".js", ".ts"];
const hasValidExtension = validExtensions.some((ext) => file.endsWith(ext));

if (!hasValidExtension) {
	console.error("File must be a javascript or typescript file");
	Deno.exit(1);
}

const rules = await getJson(".nicerrc");
const text = await Deno.readTextFile("./" + file);
const parser = new Parser();
const program = parser.produceAST(text);
const formattedCode = formatAST(program, rules);
await Deno.writeTextFile("./" + file, formattedCode);
