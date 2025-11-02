// parser/parser.test.js

import Program, { LetStatement } from '../src/ast.js';
import Lexer from '../src/lexer.js';
import Parser from '../src/parser.js';
import { checkParserErrors, testLiteralExpression } from './helper.js';

/**
 * 测试 ParseProgram 对 let 语句的解析能力。
 */
function testLetStatements() {
  const inputs = [
    {
      input: "let x = 5;",
      expectedIdentifier: "x",
      expectedValue: 5
    },
    {
      input: "let y = 10;",
      expectedIdentifier: "y",
      expectedValue: 10
    },
    {
      input: "let foobar = 838383;",
      expectedIdentifier: "foobar",
      expectedValue: 838383
    }
  ]
  inputs.forEach((test_input, i) => {
    const input = test_input.input
    const expectedIdentifier = test_input.expectedIdentifier
    const expectedValue = test_input.expectedValue

    const lexer = new Lexer(input);
    const parser = new Parser(lexer);

    /**
     * @type {Program} 变量描述
     */
    const program = parser.parseProgram();
    checkParserErrors(parser);

    console.assert(program !== null, 'ParseProgram() 返回了 null');
    console.assert(
      program.statements.length === 1,
      `program.statements 不包含 1 个语句，实际为 ${program.statements.length}`
    );

    /**
     * @type {LetStatement} 变量描述
     */
    const stmt = program.statements[0];
    const ok = testLetStatement(stmt, expectedIdentifier);
    if (!ok) {
      return;
    }
    const value = stmt.value
    testLiteralExpression(console, value, expectedValue)

  })
  console.log('✅ testLetStatements 测试通过！');


}

/**
 * 测试某个语句是否为合法的 let 声明
 * @param {import('../src/ast.js').Statement} stmt
 * @param {string} name - 预期的变量名
 * @returns {boolean}
 */
function testLetStatement(stmt, name) {
  console.assert(
    stmt.tokenLiteral() === 'let',
    `stmt.tokenLiteral() 不为 'let'，实际为 ${stmt.tokenLiteral()}`
  );

  // 检查是否是 LetStatement 类型
  if (!(stmt instanceof LetStatement)) {
    console.error(`stmt 类型不是 LetStatement，实际为 ${stmt?.constructor?.name || typeof stmt}`);
    return false;
  }

  console.assert(
    stmt.name.value === name,
    `letStmt.name.value 应为 '${name}'，实际为 ${stmt.name.value}`
  );

  console.assert(
    stmt.name.tokenLiteral() === name,
    `letStmt.name.tokenLiteral() 应为 '${name}'，实际为 ${stmt.name.tokenLiteral()}`
  );

  return true;
}

// ✅ 执行测试
testLetStatements();
