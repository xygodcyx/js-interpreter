// test/evaluator.test.js
import { testEval, testIntegerObject, testBooleanObject, testNullObject } from './helper.js';

/**
 * 测试整数求值
 */
function testEvalIntegerExpression() {
    const tests = [
        { input: '5', expected: 5 },
        { input: '10', expected: 10 },
        { input: '-5', expected: -5 },
        { input: '-10', expected: -10 },
        { input: '5 + 5 + 5 + 5 - 10', expected: 10 },
        { input: '2 * 2 * 2 * 2 * 2', expected: 32 },
        { input: '-50 + 100 + -50', expected: 0 },
        { input: '5 * 2 + 10', expected: 20 },
        { input: '5 + 2 * 10', expected: 25 },
        { input: '20 + 2 * -10', expected: 0 },
        { input: '50 / 2 * 2 + 10', expected: 60 },
        { input: '2 * (5 + 10)', expected: 30 },
        { input: '3 * 3 * 3 + 10', expected: 37 },
        { input: '3 * (3 * 3) + 10', expected: 37 },
        { input: '(5 + 10 * 2 + 15 / 3) * 2 + -10', expected: 50 },
    ];

    for (const test of tests) {
        const evaluated = testEval(test.input);
        if (!testIntegerObject(evaluated, test.expected)) {
            return;
        }
    }

    console.log('✅ testEvalIntegerExpression 测试通过！');
}

/**
 * 测试布尔求值
 */
function testEvalBooleanExpression() {
    const tests = [
        { input: 'true', expected: true },
        { input: 'false', expected: false },
        { input: '1 < 2', expected: true },
        { input: '1 > 2', expected: false },
        { input: '1 < 1', expected: false },
        { input: '1 > 1', expected: false },
        { input: '1 == 1', expected: true },
        { input: '1 != 1', expected: false },
        { input: '1 == 2', expected: false },
        { input: '1 != 2', expected: true },
        { input: 'true == true', expected: true },
        { input: 'false == false', expected: true },
        { input: 'true == false', expected: false },
        { input: 'true != false', expected: true },
        { input: 'false != true', expected: true },
        { input: '(1 < 2) == true', expected: true },
        { input: '(1 < 2) == false', expected: false },
        { input: '(1 > 2) == true', expected: false },
        { input: '(1 > 2) == false', expected: true },
    ];

    for (const tt of tests) {
        const evaluated = testEval(tt.input);
        if (!testBooleanObject(evaluated, tt.expected)) {
            return;
        }
    }

    console.log('✅ testEvalBooleanExpression 测试通过！');
}

/**
 * 测试前缀求值
 */
function testBangOperator() {
    const tests = [
        { input: '!true', expected: false },
        { input: '!false', expected: true },
        { input: '!5', expected: false },
        { input: '!!true', expected: true },
        { input: '!!false', expected: false },
        { input: '!!5', expected: true },
    ];

    for (const tt of tests) {
        const evaluated = testEval(tt.input);
        if (!testBooleanObject(evaluated, tt.expected)) {
            return;
        }
    }

    console.log('✅ testBangOperator 测试通过！');
}

/**
 * 测试 if-else 表达式求值
 */
function TestIfElseExpression() {
    const tests = [
        { input: 'if (true) { 10 }', expected: 10 },
        { input: 'if (false) { 10 }', expected: null },
        { input: 'if (1) { 10 }', expected: 10 },
        { input: 'if (1 < 2) { 10 }', expected: 10 },
        { input: 'if (1 > 2) { 10 }', expected: null },
        { input: 'if (1 > 2) { 10 } else { 20 }', expected: 20 },
        { input: 'if (1 < 2) { 10 } else { 20 }', expected: 10 },
    ];

    for (const tt of tests) {
        const evaluated = testEval(tt.input);

        if (typeof tt.expected === 'number') {
            if (!testIntegerObject(evaluated, tt.expected)) {
                console.log(`failed: input=${tt.input}`);
                return;
            }
        } else {
            if (!testNullObject(evaluated)) {
                console.log(`failed: input=${tt.input}, expected null`);
                return;
            }
        }
    }

    console.log('✅ TestIfElseExpression 测试通过！');
}

/**
 * 测试 return 语句求值
 */
function TestReturnStatements() {
    const tests = [
        // { input: 'return 10;', expected: 10 },
        // { input: 'return 10; 9;', expected: 10 },
        // { input: 'return 2 * 5; 9;', expected: 10 },
        // { input: '9; return 2 * 5; 9;', expected: 10 },
        {
            input: `if (10 > 1) {
                        if (10 > 1) {
                            return 10;
                        }
                        return 1;
                    }`,
            expected: 10,
        },
    ];

    for (const tt of tests) {
        const evaluated = testEval(tt.input);
        if (!testIntegerObject(evaluated, tt.expected)) {
            console.log(`failed: input=${tt.input}, expected=${tt.expected}`);
            return;
        }
    }
    console.log('✅ TestIfElseExpression 测试通过！');
}

// 手动运行测试
testEvalIntegerExpression();

// 手动运行测试
testEvalBooleanExpression();

// 手动运行测试
testBangOperator();

// 手动运行测试
TestIfElseExpression();

// 手动运行测试
TestReturnStatements();
