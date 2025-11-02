import Parser from '../src/parser.js';
import Lexer from '../src/lexer.js';
import Program, { BlockStatement, ExpressionStatement, FunctionLiteral, IfExpression, Statement } from '../src/ast.js';
import { checkParserErrors, testIdentifier, testInfixExpression, testLiteralExpression } from './helper.js';

/**
 * 测试IF表达式
 */
function testFunctionExpression() {
    const input = 'fn(a,b) { a + b;}';
    const expectedParams = ["a", "b"]

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
        stmt.expression instanceof FunctionLiteral,
        `stmt 应为 FunctionExpression 类型，实际为 ${stmt?.constructor?.name}`
    );

    /**
     * @type {FunctionLiteral} 变量描述
     */
    const exp = stmt.expression

    exp.params.forEach((param, i) => {
        if (!testLiteralExpression(console, param, expectedParams[i])) {
            return
        }
    })

    /**
     * @type {BlockStatement}
     */
    const body = exp.body

    if (exp.body.statements == null) {
        console.error("exp.body.statements was nil")
    }
    if (exp.body.statements.length !== 1) {
        console.error(`function.Body.Statements has not 1 statements. got=${exp.body.statements.length}`)
    }
    console.assert(exp.body.statements[0] instanceof ExpressionStatement, `function body stmt is not ast.ExpressionStatement. got=${exp.body.statements[0]?.constructor?.name}`)
    if (!testInfixExpression(console, body.statements[0].expression, "a", "+", "b")) {
        return
    }
    console.log('✅ testFunctionExpression 测试通过！');
}

function testFunctionParamsExpression() {
    const inputs = [
        {
            input: 'fn() {}',
            expectedParams: []
        },
        {
            input: 'fn(a) {}',
            expectedParams: ["a"]
        },
        {
            input: 'fn(a,b,c) {}',
            expectedParams: ["a", "b", "c"]
        }
    ]
    for (const test_input of inputs) {
        const input = test_input.input
        const expectedParams = test_input.expectedParams
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
            stmt.expression instanceof FunctionLiteral,
            `stmt 应为 FunctionExpression 类型，实际为 ${stmt?.constructor?.name}`
        );

        /**
         * @type {FunctionLiteral} 变量描述
         */
        const exp = stmt.expression

        exp.params.forEach((param, i) => {
            if (!testLiteralExpression(console, param, expectedParams[i])) {
                return
            }
        })

    }

    console.log('✅ testFunctionParamsExpression 测试通过！');
}


// ✅ 执行测试
testFunctionExpression();

testFunctionParamsExpression()
