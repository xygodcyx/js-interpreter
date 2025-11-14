// repl.js
import readline from 'node:readline';
import Lexer from './lexer.js';
import Parser from './parser.js';
import { printParserErrors } from '../test/helper.js';
import Eval, { globalEnv } from './evaluator.js';
import { ObjectType } from './object.js';
import os from 'node:os';

const PROMPT = '>> ';
/**
 * @type {readline.Interface}
 */
export let rl;
export async function startRepl() {
    const userInfo = os.userInfo();
    console.log(`Hello ${userInfo.username}! This is the Monkey programming language!`);
    console.log('Feel free to type in commands');
    rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: PROMPT,
    });
    console.log(`
.__                  
  ________ __|  |__   ____  __ __ 
 / ____/  |  \  |  \ /  _ \|  |  \
< <_|  |  |  /   Y  (  <_> )  |  /
 \__   |____/|___|  /\____/|____/ 
    |__|          \/           
`);
    console.log('Welcome to the Monkey REPL (JavaScript v20.1)');
    rl.prompt();
    rl.on('line', async line => {
        const lexer = new Lexer(line);
        const parser = new Parser(lexer);
        const program = parser.parseProgram();
        if (parser.Errors().length !== 0) {
            printParserErrors(console, parser.Errors());
            rl.prompt();
            return;
        }
        const evaluated = await Eval(program, globalEnv);
        if (evaluated) {
            evaluated.Type() !== ObjectType.VOID_OBJ && console.log(`${evaluated.Inspect()}`);
        }
        rl.prompt();
    }).on('close', () => {
        console.log('Bye!');
        process.exit(0);
    });
}
