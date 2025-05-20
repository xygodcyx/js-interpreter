// parser/parser.test.js

import Program, { Identifier, LetStatement } from '../src/ast.js';
import Parser from '../src/parser.js';
import Token from '../src/token.js';

/**
 * 检查解析器是否存在错误。如果有，则打印错误并中止测试。
 * @param {Parser} parser
 */
function checkParserErrors(parser) {
  const errors = parser.Errors();
  if (errors.length === 0) return;

  console.error(`解析器共出现 ${errors.length} 个错误：`);
  for (const msg of errors) {
    console.error(`  解析器错误：${msg}`);
  }
  throw new Error('❌ 解析器存在错误，请检查日志输出');
}

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
