// parser.test.js

import Lexer from '../src/lexer.js';
import Parser from '../src/parser.js';
import { ExpressionStatement, StringLiteral } from '../src/ast.js';
import { checkParserErrors } from './helper.js';

/**
 * 测试整数文字表达式解析是否正确。
 */
function testStringLiteralExpression() {
    const input = '"hello world"';
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    const program = parser.parseProgram();
    checkParserErrors(parser);
    console.assert(
        program.statements.length === 1,
        `program.statements.length 应为 1，实际为 ${program.statements.length}`
    );

    const stmt = program.statements[0];
    console.assert(
        stmt instanceof ExpressionStatement,
        `stmt 应为 ExpressionStatement，实际为 ${stmt.constructor.name}`
    );

    const literal = stmt.expression;
    console.assert(
        literal instanceof StringLiteral,
        `表达式应为 StringLiteral，实际为 ${literal.constructor.name}`
    );
    console.assert(literal.value === "hello world", `literal.value 应为 "hello world，实际为 ${literal.value}`);
    console.assert(
        literal.tokenLiteral() === 'hello world',
        `literal.tokenLiteral() 应为 ""hello world"，实际为 ${literal.tokenLiteral()}`
    );

    console.log('✅ testStringLiteralExpression 测试通过！');
}

// ✅ 执行测试
testStringLiteralExpression();
