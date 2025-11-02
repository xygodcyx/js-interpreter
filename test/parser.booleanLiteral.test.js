// test/parser/boolean.test.js

import Lexer from '../src/lexer.js';
import Parser from '../src/parser.js';
import { testLiteralExpression } from './helper.js';

// 测试用例
const testCases = [
  {
    input: 'true;',
    test: program => testLiteralExpression(console, program.statements[0].expression, true),
  },
  {
    input: 'false;',
    test: program => testLiteralExpression(console, program.statements[0].expression, false),
  },
];

// 执行测试
let allPass = true;
for (const { input, test } of testCases) {
  const program = new Parser(new Lexer(input)).parseProgram();
  const result = test(program);
  if (!result) {
    allPass = false;
  }
}
if (allPass) console.log('当前测试通过');
