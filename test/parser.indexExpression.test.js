import Parser from '../src/parser.js';
import Lexer from '../src/lexer.js';
import Program, {
    ArrayLiteral,
    ExpressionStatement,
    Identifier,
    IndexExpression,
} from '../src/ast.js';
import { testIdentifier, testInfixExpression, testIntegerLiteral } from './helper.js';

/**
 * 测试数组的标识符 "[1,2]"
 */
function testIndexExpression() {
    const input = 'myArray[1+1]';

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

    const expression = stmt.expression;

    if (!(expression instanceof IndexExpression)) {
        console.log(`stmt 应为 IndexExpression 类型，实际为 ${expression?.constructor?.name}`);
        return;
    }

    let identPass = testIdentifier(console, expression.left, 'myArray');

    let infixPass = testInfixExpression(console, expression.index, 1, '+', 1);

    identPass && infixPass && console.log('✅ testIdentifierExpression 测试通过！');
}

// ✅ 执行测试
testIndexExpression();
