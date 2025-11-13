// test/evaluator.test.js
import { SingleObjectInstance } from '../src/evaluator.js';
import { ErrorObject, FunctionObject, NullObject, VoidObject } from '../src/object.js';
import {
    testEval,
    testIntegerObject,
    testBooleanObject,
    testNullObject,
    testStringObject,
    testNotValueObject,
} from './helper.js';

/**
 * 测试整数求值
 */
async function testEvalIntegerExpression() {
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
        const evaluated = await testEval(test.input);
        if (!testIntegerObject(evaluated, test.expected)) {
            return;
        }
    }

    console.log('✅ await testEvalIntegerExpression 测试通过！');
}

/**
 * 测字符串求值
 */
async function testEvalStringExpression() {
    const tests = [
        { input: '"hello world"', expected: 'hello world' },
        { input: '"foobar"', expected: 'foobar' },

        { input: 'let hello_world =  "hello world"; hello_world', expected: 'hello world' },
        { input: 'let foobar = "foobar"; foobar', expected: 'foobar' },

        {
            input: 'let hello_world =  "hello" + " " + "world"; hello_world',
            expected: 'hello world',
        },
        { input: 'let foobar = "foo" + "bar"; foobar', expected: 'foobar' },

        { input: 'if("foo" == "foo"){ return "true"}', expected: 'true' },
        { input: 'if("foo" != "bar"){ return "false"}', expected: 'false' },
    ];

    for (const test of tests) {
        const evaluated = await testEval(test.input);
        if (!testStringObject(evaluated, test.expected)) {
            return;
        }
    }

    console.log('✅ await testEvalIntegerExpression 测试通过！');
}

/**
 * 测试布尔求值
 */
async function testEvalBooleanExpression() {
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

    for (const test of tests) {
        const evaluated = await testEval(test.input);
        if (!testBooleanObject(evaluated, test.expected)) {
            return;
        }
    }

    console.log('✅ await testEvalBooleanExpression 测试通过！');
}

/**
 * 测试前缀求值
 */
async function testBangOperator() {
    const tests = [
        { input: '!true', expected: false },
        { input: '!false', expected: true },
        { input: '!5', expected: false },
        { input: '!!true', expected: true },
        { input: '!!false', expected: false },
        { input: '!!5', expected: true },
    ];

    for (const test of tests) {
        const evaluated = await testEval(test.input);
        if (!testBooleanObject(evaluated, test.expected)) {
            return;
        }
    }

    console.log('✅ testBangOperator 测试通过！');
}

/**
 * 测试 if-else 表达式求值
 */
async function testIfElseExpression() {
    const tests = [
        { input: 'if (true) { return 10 }', expected: 10 },
        { input: 'if (false) { return 10 }', expected: SingleObjectInstance.VOID },
        { input: 'if (1) { return 10 }', expected: 10 },
        { input: 'if (1 < 2) {return 10 }', expected: 10 },
        { input: 'if (1 > 2) { return 10 }', expected: SingleObjectInstance.VOID },
        { input: 'if (1 > 2) { return 10 } else { return 20 }', expected: 20 },
        { input: 'if (1 < 2) { return 10 } else { return 20 }', expected: 10 },
    ];

    for (const test of tests) {
        const evaluated = await testEval(test.input);

        if (typeof test.expected === 'number') {
            if (!testIntegerObject(evaluated, test.expected)) {
                console.log(`failed: input=${test.input}`);
                return;
            }
        } else {
            if (!testNotValueObject(evaluated, test.expected)) {
                console.log(`failed: input=${test.input}, expected null`);
                return;
            }
        }
    }

    console.log('✅ TestIfElseExpression 测试通过！');
}

/**
 * 测试 while 表达式求值
 */
async function testWhileElseExpression() {
    const tests = [{ input: 'let a = 1; while (a<20) { a = a + 1 };a', expected: 20 }];

    for (const test of tests) {
        const evaluated = await testEval(test.input);

        if (typeof test.expected === 'number') {
            if (!testIntegerObject(evaluated, test.expected)) {
                console.log(`failed: input=${test.input}`);
                return;
            }
        } else {
            if (!testNullObject(evaluated)) {
                console.log(`failed: input=${test.input}, expected null`);
                return;
            }
        }
    }

    console.log('✅ testWhileElseExpression 测试通过！');
}

/**
 * 测试 return 语句求值
 */
async function testReturnStatements() {
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

    for (const test of tests) {
        const evaluated = await testEval(test.input);
        if (!testIntegerObject(evaluated, test.expected)) {
            console.log(`failed: input=${test.input}, expected=${test.expected}`);
            return;
        }
    }
    console.log('✅ TestIfElseExpression 测试通过！');
}

export async function testLetStatements() {
    const tests = [
        { input: 'let a = 5; a;', expected: 5 },
        { input: 'let a = 5 * 5; a;', expected: 25 },
        { input: 'let a = 5; let b = a; b;', expected: 5 },
        { input: 'let a = 5; let b = a; let c = a + b + 5; c;', expected: 15 },
    ];

    for (const test of tests) {
        const evaluated = await testEval(test.input);
        testIntegerObject(evaluated, test.expected);
    }

    console.log('✅ TestLetStatements 测试通过！');
}

/**
 * 测试赋值语句（assignment）
 */
async function testAssignStatements() {
    const tests = [
        { input: 'let a = 5; a = 10; a;', expected: 10 },
        { input: 'let a = 5 * 5; a = a + 5; a;', expected: 30 },
        { input: 'let a = 5; let b = a; a = b + 10; a;', expected: 15 },
    ];

    for (const test of tests) {
        const evaluated = await testEval(test.input);
        if (!testIntegerObject(evaluated, test.expected)) return;
    }

    console.log('✅ testAssignStatements 测试通过！');
}

/**
 * 测试函数
 */
async function testFunctionObject() {
    const input = 'fn(x) { x + 2; };';
    const evaluated = await testEval(input);

    console.assert(
        evaluated instanceof FunctionObject,
        `object is not Function. got=${typeof evaluated}`
    );

    console.assert(
        evaluated.parameters.length === 1,
        `async function has wrong parameters. got=${evaluated.parameters.length}`
    );

    console.assert(
        evaluated.parameters[0].toString() === 'x',
        `parameter is not 'x'. got=${evaluated.parameters[0]}`
    );

    const expectedBody = '(x + 2)';
    console.assert(
        evaluated.body.toString() === expectedBody,
        `body is not ${expectedBody}. got=${evaluated.body.toString()}`
    );

    console.log('✅ TestFunctionObject 测试通过！');
}

/**
 * 测试函数调用执行
 */
export async function TestFunctionApplication() {
    const tests = [
        { input: 'let identity = fn(x) { return x; }; identity(5);', expected: 5 },
        { input: 'let identity = fn(x) { return x; }; identity(5);', expected: 5 },
        { input: 'let double = fn(x) { return x * 2; }; double(5);', expected: 10 },
        { input: 'let add = fn(x, y) { return x + y; }; add(5, 5);', expected: 10 },
        { input: 'let add = fn(x, y) { return x + y; }; add(5 + 5, add(5, 5));', expected: 20 },
        { input: 'fn(x) { x; }(5)', expected: SingleObjectInstance.VOID },
    ];
    let pass = true;
    for (const test of tests) {
        const evaluated = await testEval(test.input);
        if (typeof test.expected === 'number' && !testIntegerObject(evaluated, test.expected)) {
            pass = false;
        } else if (
            typeof test.expected !== 'number' &&
            !testNotValueObject(evaluated, test.expected)
        ) {
            pass = false;
        }
    }
    if (pass) console.log('✅ TestFunctionApplication 测试通过！');
    else console.log('❌ TestFunctionApplication 测试失败！');
}

/**
 * 测试闭包（Closure）
 */
export async function TestClosures() {
    const input = `
let newAdder = fn(x) {
 return fn(y) { return x + y };
};

let addTwo = newAdder(2);
addTwo(2);
`;

    const evaluated = await testEval(input);
    const pass = testIntegerObject(evaluated, 4);
    if (pass) console.log('✅ TestClosures 测试通过！');
    else console.log('❌ TestClosures 测试失败！');
}

/**
 * 测试内置函数
 */
export async function TestBuiltin() {
    const tests = [
        { input: 'len("");', expected: 0 },
        { input: 'len("hello world");', expected: 11 },
        { input: 'len("foobar");', expected: 6 },

        { input: 'let cur_time = time("hour");', expected: new Date().getHours() },
    ];
    let pass = true;
    for (const test of tests) {
        const evaluated = await testEval(test.input);
        if (!testIntegerObject(evaluated, test.expected)) {
            pass = false;
        }
    }
    if (pass) console.log('✅ TestBuiltin 测试通过！');
    else console.log('❌ TestBuiltin 测试失败！');
}

/**
 * 测试数组求值
 */
export async function TestArrayLiteral() {
    const tests = [{ input: '[1,2*2,3+3];', expected: [1, 4, 6] }];
    let pass = true;
    for (const test of tests) {
        const evaluated = await testEval(test.input);
        for (const i in test.expected) {
            if (!testIntegerObject(evaluated.elements[i], test.expected[i])) {
                pass = false;
            }
        }
    }
    if (pass) console.log('✅ TestArrayLiteral 测试通过！');
    else console.log('❌ TestArrayLiteral 测试失败！');
}
/**
 * 测试索引求值
 */
export async function TestArrayIndexExpression() {
    const tests = [
        { input: '[1][0];', expected: 1 },
        { input: '[1,2,3][1];', expected: 2 },
        { input: '[1,2,3][1+1];', expected: 3 },
        { input: 'let a = 1;[1,2][a];', expected: 2 },
        { input: 'let a = 1;[1,2,3][a+1];', expected: 3 },
        // { input: 'func num(n){return n};[1,2,3][num(1)];', expected: 2 },
        { input: 'let array = [1,2,3];array[1];', expected: 2 },
        { input: 'let array = [1,2,3];array[0] + array[1] + array[2]', expected: 6 },
    ];
    const testNull = [
        { input: '[1,2,3][-1];', expected: null },
        { input: '[1,2][2];', expected: null },
    ];
    let pass = true;
    for (const test of tests) {
        const evaluated = await testEval(test.input);
        if (!testIntegerObject(evaluated, test.expected)) {
            pass = false;
        }
    }
    for (const test of testNull) {
        const evaluated = await testEval(test.input);
        if (!testNullObject(evaluated)) {
            pass = false;
        }
    }
    if (pass) console.log('✅ TestArrayIndexExpression 测试通过！');
    else console.log('❌ TestArrayIndexExpression 测试失败！');
}

/**
 * TestErrorHandling
 *
 * 用于验证解释器在遇到类型不匹配或非法运算时，
 * 是否能够返回正确的 Error 对象以及对应的错误信息。
 */
async function testErrorHandling() {
    /** @type {{input: string, expectedMessage: string}[]} */
    const tests = [
        { input: '5 + true;', expectedMessage: 'type mismatch: INTEGER + BOOLEAN' },
        { input: '5 + true; 5;', expectedMessage: 'type mismatch: INTEGER + BOOLEAN' },
        { input: '-true', expectedMessage: 'unknown operator: -BOOLEAN' },
        { input: 'true + false;', expectedMessage: 'unknown operator: BOOLEAN + BOOLEAN' },
        { input: '5; true + false; 5', expectedMessage: 'unknown operator: BOOLEAN + BOOLEAN' },
        {
            input: 'if (10 > 1) { true + false; }',
            expectedMessage: 'unknown operator: BOOLEAN + BOOLEAN',
        },
        {
            input: `
                if (10 > 1) {
                    if (10 > 1) {
                        return true + false;
                    }
                    return 1;
                }
            `,
            expectedMessage: 'unknown operator: BOOLEAN + BOOLEAN',
        },
        {
            input: 'let foobar = 2;let foobar = 3;',
            expectedMessage: 'identifier has declaration: foobar',
        },
    ];

    for (const { input, expectedMessage } of tests) {
        const evaluated = await testEval(input);

        // 检查返回结果类型是否为 ErrorObject
        console.assert(
            evaluated instanceof ErrorObject,
            `❌ no error object returned. got=${
                evaluated?.constructor?.name ?? typeof evaluated
            }(${JSON.stringify(evaluated)})`
        );

        // 检查错误信息是否匹配预期
        if (evaluated instanceof ErrorObject) {
            console.assert(
                evaluated.message === expectedMessage,
                `❌ wrong error message. expected=${expectedMessage}, got=${evaluated.message}`
            );
        }
    }

    console.log('✅ testErrorHandling 测试通过！');
}

// 手动运行测试
await testEvalIntegerExpression();

// 手动运行测试
await testEvalStringExpression();

// 手动运行测试
await testEvalBooleanExpression();

// 手动运行测试
testBangOperator();

// 手动运行测试
testIfElseExpression();

// 手动运行测试
testWhileElseExpression();

// 手动运行测试
testReturnStatements();

// 手动运行测试
testLetStatements();

// 手动运行测试
testAssignStatements();

// 手动运行测试
testFunctionObject();

// 手动运行测试
TestFunctionApplication();

// 手动运行测试
TestClosures();

// 手动运行测试
TestBuiltin();

// 手动运行测试
TestArrayLiteral();

// 手动运行测试
TestArrayIndexExpression();

// 手动运行测试
testErrorHandling();
