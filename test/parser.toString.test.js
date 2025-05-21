// parser/parser.test.js

import Program, { Identifier, LetStatement } from '../src/ast.js';
import Token from '../src/token.js';

/**
 * 测试 Program.String() 方法的输出
 */
function testString() {
  const program = new Program();
  program.statements = [
    new LetStatement(
      new Token('LET', 'let'),
      new Identifier(new Token('IDENT', 'myVar'), 'myVar'),
      new Identifier(new Token('IDENT', 'anotherVar'), 'anotherVar')
    ),
  ];

  const expected = 'let myVar = anotherVar;';
  const actual = program.toString();

  console.assert(
    actual === expected,
    `program.toString() 错误，实际为 ${actual}，预期为 ${expected}`
  );

  if (actual === expected) {
    console.log('✅ testString 测试通过！');
  }
}

testString();
