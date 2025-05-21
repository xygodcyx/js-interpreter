import Lexer from '../src/lexer.js';
import Parser from '../src/parser.js';

function testOperatorPrecedenceParsing() {
  const tests = [
    { input: '-a * b', expected: '((-a) * b)' },
    { input: '!-a', expected: '(!(-a))' },
    { input: 'a + b + c', expected: '((a + b) + c)' },
    { input: 'a + b * c + d / e - f', expected: '(((a + (b * c)) + (d / e)) - f)' },
    { input: '3 + 4; -5 * 5', expected: '(3 + 4)((-5) * 5)' },
    { input: '5 > 4 == 3 < 4', expected: '((5 > 4) == (3 < 4))' },
    { input: '3 + 4 * 5 == 3 * 1 + 4 * 5', expected: '((3 + (4 * 5)) == ((3 * 1) + (4 * 5)))' },
  ];

  for (const { input, expected } of tests) {
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    const program = parser.parseProgram();
    const actual = program.toString();
    console.assert(
      actual === expected,
      `FAILED\nInput: ${input}\nExpected: ${expected}\nGot: ${actual}`
    );
  }
  console.log('✅ testOperatorPrecedenceParsing 测试通过！');
}

testOperatorPrecedenceParsing();
