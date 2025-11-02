import Program, {
    BlockStatement,
    BooleanLiteral,
    ExpressionStatement,
    IfExpression,
    InfixExpression,
    IntegerLiteral,
    Node,
    PrefixExpression,
    ReturnStatement,
    Statement,
} from './ast.js';
import {
    BaseObject,
    BooleanObj,
    IntegerObj,
    NullObject,
    ObjectType,
    ReturnValueObject,
} from './object.js';

export const SingleObjectInstance = {
    NULL: new NullObject(),
    TRUE: new BooleanObj(true),
    FALSE: new BooleanObj(false),
};

/**
 * 解释ast节点的值
 * @param {Node} node ast节点
 * @returns {BaseObject} 返回说明
 */
export default function Eval(node) {
    if (node instanceof Program) {
        return evalProgram(node);
    } else if (node instanceof ExpressionStatement) {
        return Eval(node.expression);
    } else if (node instanceof IntegerLiteral) {
        return new IntegerObj(node.value);
    } else if (node instanceof BooleanLiteral) {
        return nativeBoolToBooleanObject(node.value);
    } else if (node instanceof PrefixExpression) {
        const right = Eval(node.right);
        return evalPrefixExpression(node.operator, right);
    } else if (node instanceof InfixExpression) {
        const left = Eval(node.left);
        const right = Eval(node.right);
        const result = evalInfixExpression(node.operator, left, right);
        return result;
    } else if (node instanceof BlockStatement) {
        return evalBlockStatement(node);
    } else if (node instanceof IfExpression) {
        return evalIfExpression(node);
    } else if (node instanceof ReturnStatement) {
        const value = Eval(node.returnValue);
        return new ReturnValueObject(value);
    }
    return null;
}

/**
 * 解释程序根语句
 * @param {Program} program 根语句数组
 * @returns {BaseObject} 解释后的对象
 */
function evalProgram(program) {
    let result = null;
    for (const stmt of program.statements) {
        result = Eval(stmt);
        if (result instanceof ReturnValueObject) {
            return result.value;
        }
    }
    return result;
}

/**
 * 解析块语句
 * @param {BlockStatement} block 块语句
 * @returns {BaseObject}
 */
function evalBlockStatement(block) {
    let result = null;
    for (const stmt of block.statements) {
        result = Eval(stmt);
        if (result instanceof ReturnValueObject) {
            return result;
        }
    }
    return result;
}

/**
 * 布尔字面量转为布尔对象
 * @param {boolean} input 布尔字面量
 * @returns {BooleanObj} 布尔对象
 */
function nativeBoolToBooleanObject(input) {
    return input ? SingleObjectInstance.TRUE : SingleObjectInstance.FALSE;
}

/**
 * 解析前缀表达式
 * @param {string} operator 前缀操作符
 * @param {BaseObject} right 前缀操作符
 * @returns {BaseObject}
 */
function evalPrefixExpression(operator, right) {
    switch (operator) {
        case '!':
            return evalBangOperatorExpression(right);
        case '-':
            return evalMinusPrefixOperatorExpression(right);

        default:
            return SingleObjectInstance.NULL;
    }
}

/**
 * 解析!前缀运算符表达式
 * @param {BaseObject} right 右操作数
 * @returns {BaseObject}
 */
function evalBangOperatorExpression(right) {
    switch (right) {
        case SingleObjectInstance.TRUE:
            return SingleObjectInstance.FALSE;
        case SingleObjectInstance.FALSE:
            return SingleObjectInstance.TRUE;
        case SingleObjectInstance.NULL:
            return SingleObjectInstance.TRUE;
        default:
            return SingleObjectInstance.FALSE;
    }
}
/**
 * 解析-前缀运算符表达式
 * @param {BaseObject} right 右操作数
 * @returns {BaseObject}
 */
function evalMinusPrefixOperatorExpression(right) {
    if (right.Type() != ObjectType.INTEGER_OBJ || !(right instanceof IntegerObj)) {
        return SingleObjectInstance.NULL;
    }
    const value = right.value;
    return new IntegerObj(-value);
}

/**
 * 解析中缀表达式
 * @param {string} operator 前缀操作符
 * @param {BaseObject} left 左操作数
 * @param {BaseObject} right 右操作数
 * @returns {BaseObject}
 */
function evalInfixExpression(operator, left, right) {
    if (left.Type() === ObjectType.INTEGER_OBJ && right.Type() === ObjectType.INTEGER_OBJ) {
        return evalIntegerInfixExpression(operator, left, right);
    } else {
        switch (operator) {
            case '==':
                return nativeBoolToBooleanObject(left === right);
            case '!=':
                return nativeBoolToBooleanObject(left !== right);
        }
    }
    return SingleObjectInstance.NULL;
}

/**
 * 解析整数中缀表达式
 * @param {string} operator 前缀操作符
 * @param {IntegerObj} left 左操作数
 * @param {IntegerObj} right 右操作数
 * @returns {IntegerObj | NullObject}
 */
function evalIntegerInfixExpression(operator, left, right) {
    const leftValue = left.value;
    const rightValue = right.value;
    switch (operator) {
        case '+':
            return new IntegerObj(leftValue + rightValue);
        case '-':
            return new IntegerObj(leftValue - rightValue);
        case '*':
            return new IntegerObj(leftValue * rightValue);
        case '/':
            return new IntegerObj(leftValue / rightValue);
        case '>':
            return nativeBoolToBooleanObject(leftValue > rightValue);
        case '<':
            return nativeBoolToBooleanObject(leftValue < rightValue);
        case '==':
            return nativeBoolToBooleanObject(leftValue === rightValue);
        case '!=':
            return nativeBoolToBooleanObject(leftValue !== rightValue);
        default:
            break;
    }
    return SingleObjectInstance.NULL;
}

/**
 * 解析if表达式
 * @param {IfExpression} ie if表达式
 * @returns {IntegerObj}
 */
function evalIfExpression(ie) {
    const condition = Eval(ie.condition);
    if (isTruthy(condition)) {
        return Eval(ie.consequence);
    } else if (ie.alternative !== null) {
        return Eval(ie.alternative);
    } else {
        return SingleObjectInstance.NULL;
    }
}

/**
 * 判断给定的解析后对象是否为“真”语义
 * @param {BaseObject} obj 要判断的解析后对象
 * @returns {IntegerObj}
 */
function isTruthy(obj) {
    switch (obj) {
        case SingleObjectInstance.NULL:
            return false;
        case SingleObjectInstance.FALSE:
            return false;
        case SingleObjectInstance.TRUE:
            return true;
        default:
            return true;
    }
}
