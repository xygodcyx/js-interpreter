import Parser from '../src/parser.js';
import Lexer from '../src/lexer.js';
import Program, { ArrayLiteral, ExpressionStatement, Identifier } from '../src/ast.js';
import { testInfixExpression, testIntegerLiteral } from './helper.js';

/**
 * 测试数组的标识符 "[1,2]"
 */
function testArrayLiteral() {
    const input = '[1, 2 * 2, 3 + 3];';

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
    const array = stmt.expression;
    if (!(array instanceof ArrayLiteral)) {
        console.log(`stmt 应为 ArrayLiteral 类型，实际为 ${array?.constructor?.name}`);
        return;
    }
    if (array.elements.length !== 3) {
        console.log(`array.elements.length not 3. got=${array.elements.length}"`);
        return;
    }
    testIntegerLiteral(console, array.elements[0], 1);
    testInfixExpression(console, array.elements[1], 2, '*', 2);
    testInfixExpression(console, array.elements[2], 3, '+', 3);

    console.log('✅ testIdentifierExpression 测试通过！');
}

// ✅ 执行测试
testArrayLiteral();
