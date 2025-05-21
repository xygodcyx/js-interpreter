// parser/parser.test.js

import Program, { ReturnStatement } from '../src/ast.js';
import Lexer from '../src/lexer.js';
import Parser from '../src/parser.js';
import { checkParserErrors } from './helper.js';

/**
 * 测试 ParseProgram 对 return 语句的解析能力。
 */
function testReturnStatements() {
  const input = `
    return 5;
    return 10;
    return 993322;
  `;

  const lexer = new Lexer(input);
  const parser = new Parser(lexer);

  /** @type {Program} */
  const program = parser.parseProgram();
  checkParserErrors(parser);

  console.assert(program !== null, 'parseProgram() 返回 null');
  console.assert(
    program.statements.length === 3,
    `program.statements 不包含 3 个语句，实际为 ${program.statements.length}`
  );

  for (let i = 0; i < program.statements.length; i++) {
    const stmt = program.statements[i];

    console.assert(
      stmt instanceof ReturnStatement,
      `stmt 不是 ReturnStatement，实际为 ${stmt?.constructor?.name || typeof stmt}`
    );

    console.assert(
      stmt.tokenLiteral() === 'return',
      `stmt.tokenLiteral() 应为 'return'，实际为 ${stmt.tokenLiteral()}`
    );
  }

  console.log('✅ testReturnStatements 测试通过！');
}

// ✅ 执行 return 测试
testReturnStatements();
