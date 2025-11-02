import Parser from '../src/parser.js';
import Lexer from '../src/lexer.js';
import Program, { BlockStatement, IfExpression, Statement } from '../src/ast.js';
import { checkParserErrors, testIdentifier, testInfixExpression } from './helper.js';

/**
 * 测试IF表达式
 */
function testIfExpression() {
    const input = 'if (x > y) { x }';

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
        stmt.expression instanceof IfExpression,
        `stmt 应为 IfExpression 类型，实际为 ${stmt?.constructor?.name}`
    );
    /**
     * @type {IfExpression} 变量描述
     */
    const exp = stmt.expression
    if (!testInfixExpression(console, exp.condition, "x", ">", "y")) {
        return
    }

    console.assert(
        exp.consequence.statements.length !== 0,
        `program.statements.length 应大于 0，实际为 ${exp.consequence.statements.length}`
    );

    /**
     * @type {Statement} 条件语句
     */
    const consequence = exp.consequence.statements[0]
    if (!consequence) {
        console.error(`Statements[0] is not ast.ExpressionStatement. got=${exp.consequence.statements[0]}`,)
    }

    if (!testIdentifier(console, consequence.expression, "x")) {
        return
    }

    if (exp.alternative != null) {
        console.error("exp.Alternative.Statements was not nil. got= ", exp.alternative)
    }

    console.log('✅ testIfExpression 测试通过！');
}

/**
 * 测试ELSE表达式
 */
function testIfElseExpression() {
    const input = 'if (x < y) { x } else { y }';

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
        stmt.expression instanceof IfExpression,
        `stmt.expression 应为 IfExpression 类型，实际为 ${stmt?.constructor?.name}`
    );
    /**
     * @type {IfExpression} 变量描述
     */
    const exp = stmt.expression
    if (!testInfixExpression(console, exp.condition, "x", "<", "y")) {
        return
    }

    console.assert(
        exp.consequence.statements.length !== 0,
        `exp.consequence.statements.length 应大于 0，实际为 ${exp.consequence.statements.length}`
    );

    /**
     * @type {BlockStatement} 条件语句
     */
    const consequence = exp.consequence
    if (!consequence.statements) {
        console.error(`Statements[0] is not ast.ExpressionStatement. got=${consequence.statements[0]}`,)
    }

    if (!testIdentifier(console, consequence.statements[0].expression, "x")) {
        return
    }

    const alternative = exp.alternative
    if (alternative == null) {
        console.error("exp.Alternative.Statements was nil")
    }

    if (!testIdentifier(console, alternative.statements[0].expression, "y")) {
        return
    }


    console.log('✅ testIfElseExpression 测试通过！');
}


// ✅ 执行测试
// testIfExpression();

testIfElseExpression();
