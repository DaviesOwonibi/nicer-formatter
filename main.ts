import JsParser from "./frontend/js/parser.ts";
import formatJsAST from "./backend/js/formatter.ts";
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
  console.error("Usage: nice file or file");
  Deno.exit(1);
}
const jsExtensions = [".js", ".ts"];
const rules = await getJson(".nicerrc");
const text = await Deno.readTextFile("./" + file);

if (jsExtensions.some((ext) => file.endsWith(ext))) {
  const parser = new JsParser();
  const program = parser.produceAST(text);
  //console.log(program);
  const formattedCode = formatJsAST(program, rules);
  await Deno.writeTextFile("./" + file, formattedCode);
} else {
  console.error("Filetype not yet supported");
  Deno.exit(0);
}
