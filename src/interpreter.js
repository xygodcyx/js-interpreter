import fs from 'fs';
import Lexer from './lexer.js';
import Parser from './parser.js';
import { printParserErrors } from '../test/helper.js';
import Eval, { globalEnv } from './evaluator.js';

export async function runMonkey(filePath) {
    const file = filePath || process.argv[2];
    if (!file) {
        return new Error("请指定要执行的.mky文件")
    }
    const source = fs.readFileSync(file, 'utf-8');
    const lexer = new Lexer(source);
    const parser = new Parser(lexer);
    const program = parser.parseProgram();
    if (parser.Errors().length !== 0) {
        printParserErrors(console, parser.Errors());
        return;
    }
    await Eval(program, globalEnv);
}
