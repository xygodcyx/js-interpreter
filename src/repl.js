// repl.js
import readline from 'node:readline';
import Lexer from './lexer.js';
import { TokenTypes } from './token.js';

const PROMPT = '>> ';

export function startRepl() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: PROMPT,
  });

  console.log('Welcome to the Monkey REPL (JavaScript version)');
  rl.prompt();

  rl.on('line', line => {
    const lexer = new Lexer(line);
    console.log(line);
    for (let tok = lexer.nextToken(); tok.type !== TokenTypes.EOF; tok = lexer.nextToken()) {
      console.log(tok);
    }

    rl.prompt();
  }).on('close', () => {
    console.log('Bye!');
    process.exit(0);
  });
}
