// src/object.js
/**
 * Monkey 对象系统（Object System）
 * 支持 INTEGER、BOOLEAN、NULL 三种基本类型。
 */

/**
 * ObjectType 常量表
 * 与 TokenTypes 设计风格保持一致。
 */
export const ObjectType = {
    INTEGER_OBJ: 'INTEGER',
    BOOLEAN_OBJ: 'BOOLEAN',
    NULL_OBJ: 'NULL',
    RETURN_VALUE_OBJ: 'RETURN_VALUE',
};

/**
 * 所有运行时对象的基类。
 */
export class BaseObject {
    /**
     * @returns {string} 对象类型，来自 ObjectType 常量表
     */
    Type() {
        throw new Error('Type() must be implemented by subclass');
    }

    /**
     * @returns {string} 对象的可打印字符串形式
     */
    Inspect() {
        throw new Error('Inspect() must be implemented by subclass');
    }
}

/**
 * 整数对象
 */
export class IntegerObj extends BaseObject {
    /**
     * @param {number} value
     */
    constructor(value) {
        super();
        this.value = value;
    }

    Type() {
        return ObjectType.INTEGER_OBJ;
    }

    Inspect() {
        return String(this.value);
    }
}

/**
 * 布尔对象
 */
export class BooleanObj extends BaseObject {
    /**
     * @param {boolean} value
     */
    constructor(value) {
        super();
        this.value = value;
    }

    Type() {
        return ObjectType.BOOLEAN_OBJ;
    }

    Inspect() {
        return String(this.value);
    }
}

/**
 * 空对象（Null）
 */
export class NullObject extends BaseObject {
    Type() {
        return ObjectType.NULL_OBJ;
    }

    Inspect() {
        return 'null';
    }
}

/**
 * 返回值
 */
export class ReturnValueObject extends BaseObject {
    /**
     * @constructor
     * @param {BaseObject} value 返回的值，可以是任意BaseObject实例
     */
    constructor(value) {
        super()
        this.value = value;
    }
    Type() {
        return ObjectType.RETURN_VALUE_OBJ;
    }

    Inspect() {
        return this.value.Inspect();
    }
}
