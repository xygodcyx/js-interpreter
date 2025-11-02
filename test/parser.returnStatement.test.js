// parser/parser.test.js

import Program, { ReturnStatement } from '../src/ast.js';
import Lexer from '../src/lexer.js';
import Parser from '../src/parser.js';
import { checkParserErrors, testLiteralExpression } from './helper.js';

/**
 * 测试 ParseProgram 对 return 语句的解析能力。
 */
function testReturnStatements() {
  const inputs = [
    {
      input: "return 5;",
      expectedValue: 5
    },
    {
      input: "return 10;",
      expectedValue: 10
    },
    {
      input: "return 993322;",
      expectedValue: 993322
    }
  ]

  inputs.forEach((test_input, i) => {
    const input = test_input.input
    const expectedValue = test_input.expectedValue

    const lexer = new Lexer(input);
    const parser = new Parser(lexer);

    /** @type {Program} */
    const program = parser.parseProgram();
    checkParserErrors(parser);

    console.assert(program !== null, 'parseProgram() 返回 null');
    console.assert(
      program.statements.length === 1,
      `program.statements 不包含 1 个语句，实际为 ${program.statements.length}`
    );

    /**
     * @type {ReturnStatement} 变量描述
     */
    const stmt = program.statements[0];

    console.assert(
      stmt instanceof ReturnStatement,
      `stmt 不是 ReturnStatement，实际为 ${stmt?.constructor?.name || typeof stmt}`
    );

    console.assert(
      stmt.tokenLiteral() === 'return',
      `stmt.tokenLiteral() 应为 'return'，实际为 ${stmt.tokenLiteral()}`
    );

    testLiteralExpression(console, stmt.returnValue, expectedValue)
  })



  console.log('✅ testReturnStatements 测试通过！');
}

// ✅ 执行 return 测试
testReturnStatements();
