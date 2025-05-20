// ast/ast.js

import { TokenTypes } from './token.js';

/**
 * @typedef {object} Token
 * @property {string} type
 * @property {string} literal
 */

/**
 * 表示完整程序的根节点
 */
export default class Program {
  constructor() {
    /** @type {Statement[]} */
    this.statements = [];
  }

  /**
   * 返回程序中第一个语句的 token 字面量
   * @returns {string}
   */
  tokenLiteral() {
    return this.statements.length > 0 ? this.statements[0].tokenLiteral() : '';
  }

  /**
   * 返回整个程序的字符串表示（用于调试 AST）
   * @returns {string}
   */
  toString() {
    return this.statements.map(s => s.toString()).join('');
  }
}

/**
 * 表示所有 AST 节点的基类接口
 * @interface
 */
export class Node {
  /**
   * 返回该节点的 token literal（用于调试）
   * @returns {string}
   */
  tokenLiteral() {
    throw new Error('tokenLiteral() must be implemented');
  }
  /**
   * 返回该节点的字符串形式（用于调试或打印 AST）
   * @returns {string}
   */
  toString() {
    throw new Error('toString() must be implemented');
  }
}

/**
 * 表示语句的接口（如 let 声明）
 * @interface
 * @extends Node
 */
export class Statement extends Node {
  statementNode() {
    throw new Error('statementNode() must be implemented');
  }
}

/**
 * 表示表达式的接口（如变量名、1+1）
 * @interface
 * @extends Node
 */
export class Expression extends Node {
  expressionNode() {
    throw new Error('expressionNode() must be implemented');
  }
}

/**
 * 表示一个变量声明语句（如 let x = 5;）
 * @extends Statement
 */
export class LetStatement extends Statement {
  /**
   * 创建 LetStatement 节点
   * @param {Token} token - 表示 'let' 的 token
   * @param {Identifier} name - 变量名
   * @param {Expression} value - 表达式（变量的值）
   */
  constructor(token, name, value) {
    super();
    this.token = token; // 一般是 { type: 'LET', literal: 'let' }
    this.name = name; // Identifier 类型
    this.value = value; // Expression 类型（可以是 Literal、Identifier 等）
  }

  /**
   * 标识此为语句节点
   */
  statementNode() {}

  /**
   * 返回该语句的 token 字面量（'let'）
   * @returns {string}
   */
  tokenLiteral() {
    return this.token.literal;
  }

  toString() {
    let out = '';

    out += this.tokenLiteral() + ' ';
    out += this.name.toString();
    out += ' = ';

    if (this.value) {
      out += this.value.toString();
    }

    out += ';';

    return out;
  }
}

/**
 * 表示一个标识符（变量名等，如 x、y、result）
 * @extends Expression
 */
export class Identifier extends Expression {
  /**
   * 创建一个标识符节点
   * @param {Token} token - 一般是 { type: 'IDENT', literal: 'x' }
   * @param {string} value - 变量名（如 "x"）
   */
  constructor(token, value) {
    super();
    this.token = token;
    this.value = value;
  }

  /**
   * 标识此为表达式节点
   */
  expressionNode() {}

  /**
   * 返回该标识符的原始字面量（变量名）
   * @returns {string}
   */
  tokenLiteral() {
    return this.token.literal;
  }

  toString() {
    return this.value;
  }
}

/**
 * 表示 return 语句
 */
export class ReturnStatement {
  /**
   * @param {Token} token - 'return' 词法单元
   * @param {Expression|null} returnValue - 返回的表达式
   */
  constructor(token, returnValue = null) {
    this.token = token;
    this.returnValue = returnValue;
  }

  /**
   * 表示这是一个语句节点（空方法，用于类型标识）
   */
  statementNode() {}

  /**
   * 返回 token 的字面量
   * @returns {string}
   */
  tokenLiteral() {
    return this.token.literal;
  }

  toString() {
    let out = '';

    out += this.tokenLiteral() + ' ';

    if (this.returnValue) {
      out += this.returnValue.toString();
    }

    out += ';';

    return out;
  }
}

/**
 * 表达式语句（statement）类。
 * 每条语句其实就是一个表达式（如 `x + 10;`）。
 */
export class ExpressionStatement {
  /**
   * @param {Token} token - 该语句中的第一个词法单元
   */
  constructor(token) {
    /** @type {Token} */
    this.token = token;

    /** @type {Expression | null} */
    this.expression = null;
  }

  /**
   * 返回该语句的 token 的字面量，用于调试输出。
   * @returns {string}
   */
  tokenLiteral() {
    return this.token.literal;
  }

  /**
   * 为了统一接口，表示这是一个语句（Statement）。
   * 没有实际用途，只为兼容结构。
   */
  statementNode() {}

  toString() {
    if (this.expression) {
      return this.expression.toString();
    }
    return '';
  }
}
