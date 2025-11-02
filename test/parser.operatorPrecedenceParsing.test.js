import Lexer from '../src/lexer.js';
import Parser from '../src/parser.js';
import { checkParserErrors } from './helper.js';

function testOperatorPrecedenceParsing() {
  const tests = [
    { input: 'true', expected: 'true' },
    { input: 'false', expected: 'false' },
    { input: '3 > 5 == false', expected: '((3 > 5) == false)' },
    { input: '3 < 5 == true', expected: '((3 < 5) == true)' },
    { input: '-a * b', expected: '((-a) * b)' },
    { input: '!-a', expected: '(!(-a))' },
    { input: 'a + b + c', expected: '((a + b) + c)' },
    { input: 'a + b * c + d / e - f', expected: '(((a + (b * c)) + (d / e)) - f)' },
    { input: '3 + 4; -5 * 5', expected: '(3 + 4)((-5) * 5)' },
    { input: '5 > 4 == 3 < 4', expected: '((5 > 4) == (3 < 4))' },
    { input: '3 + 4 * 5 == 3 * 1 + 4 * 5', expected: '((3 + (4 * 5)) == ((3 * 1) + (4 * 5)))' },
    {
      input: '1 + (2 + 3) + 4',
      expected: '((1 + (2 + 3)) + 4)',
    },
    {
      input: '(5 + 5) * 2',
      expected: '((5 + 5) * 2)',
    },
    {
      input: '2 / (5 + 5)',
      expected: '(2 / (5 + 5))',
    },
    {
      input: '-(5 + 5)',
      expected: '(-(5 + 5))',
    },
    {
      input: '!(true == true)',
      expected: '(!(true == true))',
    },

    {
      input: "a + add(b * c) + d",
      expected: "((a + add((b * c))) + d)",
    },
    {
      input: "add(a, b, 1, 2 * 3, 4 + 5, add(6, 7 * 8))",
      expected: "add(a, b, 1, (2 * 3), (4 + 5), add(6, (7 * 8)))",
    },
    {
      input: "add(a + b + c * d / f + g)",
      expected: "add((((a + b) + ((c * d) / f)) + g))",
    },
  ];

  for (const { input, expected } of tests) {
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    const program = parser.parseProgram();
    checkParserErrors(parser);
    const actual = program.toString();
    console.assert(
      actual === expected,
      `FAILED\nInput: ${input}\nExpected: ${expected}\nGot: ${actual}`
    );
  }
  console.log('✅ testOperatorPrecedenceParsing 测试通过！');
}

testOperatorPrecedenceParsing();
