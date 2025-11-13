import Parser from '../src/parser.js';
import Lexer from '../src/lexer.js';
import Program, { BlockStatement, IfExpression, Statement, WhileExpression } from '../src/ast.js';
import { checkParserErrors, testIdentifier, testInfixExpression } from './helper.js';

/**
 * 测试IF表达式
 */
function testWhileExpression() {
    const input = 'while (x > y) { x }';

    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    /**
     * @type {Program}
     */
    const program = parser.parseProgram();
    checkParserErrors(parser);

    console.assert(program !== null, 'program 不能为 null');
    console.assert(
        program.statements.length === 1,
        `program.statements.length 应为 1，实际为 ${program.statements.length}`
    );

    const stmt = program.statements[0];
    console.assert(
        stmt.expression instanceof WhileExpression,
        `stmt 应为 WhileExpression 类型，实际为 ${stmt?.constructor?.name}`
    );
    /**
     * @type {WhileExpression} 变量描述
     */
    const exp = stmt.expression;
    if (!testInfixExpression(console, exp.condition, 'x', '>', 'y')) {
        return;
    }

    console.assert(
        exp.consequence.statements.length !== 0,
        `program.statements.length 应大于 0，实际为 ${exp.consequence.statements.length}`
    );

    /**
     * @type {Statement} 条件语句
     */
    const consequence = exp.consequence.statements[0];
    if (!consequence) {
        console.error(
            `Statements[0] is not ast.ExpressionStatement. got=${exp.consequence.statements[0]}`
        );
    }

    if (!testIdentifier(console, consequence.expression, 'x')) {
        return;
    }

    console.log('✅ testWhileExpression 测试通过！');
}

// ✅ 执行测试
testWhileExpression();
