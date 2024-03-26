import Parser from "./frontend/parser.ts";
import formatAST from "./backend/formatter.ts";

async function repl() {
  const parser = new Parser();

  while (true) {
    const input = prompt("> ");

    if (!input || input.includes("exit")) {
      Deno.exit(1);
    } else {
      if (
        input.toLowerCase().includes("cls") ||
        input.toLowerCase().includes("clear")
      ) {
        console.clear();
      } else {
        const program = parser.produceAST(input);
        const formattedCode = formatAST(program);
        console.log(formattedCode);
      }
    }
  }
}

// repl();

const text = await Deno.readTextFile("./test.txt");
const parser = new Parser
const program = parser.produceAST(text)
const formattedCode = formatAST(program)
await Deno.writeTextFile("./test.txt", formattedCode)
