import Parser from '../src/parser.js';
import Lexer from '../src/lexer.js';
import Program, { ExpressionStatement, Identifier } from '../src/ast.js';

/**
 * 测试解析标识符表达式 "foobar;"
 */
function testIdentifierExpression() {
  const input = 'foobar;';

  const lexer = new Lexer(input);
  const parser = new Parser(lexer);
  /**
   * @type {Program}
   */
  const program = parser.parseProgram();

  console.assert(program !== null, 'program 不能为 null');
  console.assert(
    program.statements.length === 1,
    `program.statements.length 应为 1，实际为 ${program.statements.length}`
  );

  const stmt = program.statements[0];
  console.assert(
    stmt instanceof ExpressionStatement,
    `stmt 应为 ExpressionStatement 类型，实际为 ${stmt?.constructor?.name}`
  );

  const ident = stmt.expression;
  console.assert(
    ident instanceof Identifier,
    `stmt.expression 应为 Identifier 类型，实际为 ${ident?.constructor?.name}`
  );
  console.assert(ident.value === 'foobar', `ident.value 应为 'foobar'，实际为 ${ident.value}`);
  console.assert(
    ident.tokenLiteral() === 'foobar',
    `ident.tokenLiteral() 应为 'foobar'，实际为 ${ident.tokenLiteral()}`
  );

  console.log('✅ testIdentifierExpression 测试通过！');
}

// ✅ 执行测试
testIdentifierExpression();
