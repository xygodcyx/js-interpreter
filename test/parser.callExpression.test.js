import Parser from '../src/parser.js';
import Lexer from '../src/lexer.js';
import Program, { BlockStatement, CallExpression, ExpressionStatement, FunctionLiteral, IfExpression, Statement } from '../src/ast.js';
import { checkParserErrors, testIdentifier, testInfixExpression, testLiteralExpression } from './helper.js';

/**
 * 测试Call表达式
 */
function testCallExpression() {
    const input = 'add(1 , 2 * 3 , 4 + 5)';
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    /**
     * @type {Program}
     */
    const program = parser.parseProgram();
    checkParserErrors(parser)

    console.assert(program !== null, 'program 不能为 null');
    console.assert(
        program.statements.length === 1,
        `program.statements.length 应为 1，实际为 ${program.statements.length}`
    );

    const stmt = program.statements[0];
    console.assert(
        stmt.expression instanceof CallExpression,
        `stmt 应为 CallExpression 类型，实际为 ${stmt?.constructor?.name}`
    );

    /**
     * @type {CallExpression} 变量描述
     */
    const exp = stmt.expression

    if (!testLiteralExpression(console, exp.function, "add")) {
        return
    }

    testLiteralExpression(console, exp.arguments[0], 1)
    testInfixExpression(console, exp.arguments[1], 2, "*", 3)
    testInfixExpression(console, exp.arguments[2], 4, "+", 5)

    console.log('✅ testCallExpression 测试通过！');
}


// ✅ 执行测试
testCallExpression();