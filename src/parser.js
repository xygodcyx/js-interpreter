// parser.js

/**
 * @typedef {( ) => Expression} PrefixParseFn
 * @typedef {(left: Expression) => Expression} InfixParseFn
 */

import Token from './token.js';
import { TokenTypes } from './token.js';
import Program, {
  LetStatement,
  Identifier,
  Statement,
  ReturnStatement,
  ExpressionStatement,
  Expression,
} from './ast.js';
import Lexer from './lexer.js';

const Precedences = {
  LOWEST: 1,
  EQUALS: 2,
  LESSGREATER: 3,
  SUM: 4,
  PRODUCT: 5,
  PREFIX: 6,
  CALL: 7,
};

/**
 * 解析器 Parser 类
 */
export default class Parser {
  /**
   * @param {Lexer} lexer - 词法分析器实例
   */
  constructor(lexer) {
    this.lexer = lexer;

    /** @type {Token} */
    this.curToken = null;

    /** @type {Token} */
    this.peekToken = null;

    /** @type {string[]} */
    this.errors = [];

    // 前缀与中缀函数映射表
    /** @type {Object<string, PrefixParseFn>} */
    this.prefixParseFns = {};

    /** @type {Object<string, InfixParseFn>} */
    this.infixParseFns = {};

    this.nextToken();
    this.nextToken();

    // 注册前缀解析函数
    this.registerPrefix(TokenTypes.IDENT, this.parseIdentifier.bind(this));
  }

  /**
   * 注册前缀解析函数
   * @param {string} tokenType
   * @param {PrefixParseFn} fn
   */
  registerPrefix(tokenType, fn) {
    this.prefixParseFns[tokenType] = fn;
  }

  /**
   * 注册中缀解析函数
   * @param {string} tokenType
   * @param {InfixParseFn} fn
   */
  registerInfix(tokenType, fn) {
    this.infixParseFns[tokenType] = fn;
  }

  /**
   * 返回收集到的所有错误
   * @returns {string[]}
   */
  Errors() {
    return this.errors;
  }

  /**
   * 添加一个 peek 错误消息
   * @param {string} expectedType
   */
  peekError(expectedType) {
    const msg = `expected next token to be ${expectedType}, got ${this.peekToken.type} instead`;
    this.errors.push(msg);
  }

  /**
   * 获取下一个 token，更新当前和下一个 token
   */
  nextToken() {
    this.curToken = this.peekToken;
    this.peekToken = this.lexer.nextToken();
  }

  /**
   * 解析程序主入口
   * @returns {Program}
   */
  parseProgram() {
    const program = new Program();
    program.statements = [];

    while (this.curToken.type !== TokenTypes.EOF) {
      const stmt = this.parseStatement();
      if (stmt !== null) {
        program.statements.push(stmt);
      }
      this.nextToken();
    }

    return program;
  }

  /**
   * 根据当前 token 类型解析语句
   * @returns {Statement | null}
   */
  parseStatement() {
    switch (this.curToken.type) {
      case TokenTypes.LET:
        return this.parseLetStatement();
      case TokenTypes.RETURN:
        return this.parseReturnStatement();
      default:
        return this.parseExpressionStatement();
    }
  }

  /**
   * 解析表达式语句
   * @returns {ExpressionStatement}
   */
  parseExpressionStatement() {
    const stmt = new ExpressionStatement(this.curToken);

    stmt.expression = this.parseExpression(Precedences.LOWEST);

    if (this.peekTokenIs(TokenTypes.SEMICOLON)) {
      this.nextToken();
    }

    return stmt;
  }

  /**
   * @param {number} precedence
   * @returns {Expression | null}
   */
  parseExpression(precedence) {
    const prefix = this.prefixParseFns[this.curToken.type];
    if (!prefix) {
      // 如果没有注册对应的前缀解析函数，直接返回 null
      return null;
    }

    const leftExp = prefix();

    // TODO: 后续支持中缀解析时会在这里扩展
    return leftExp;
  }

  /**
   * 解析 let 语句
   * @returns {LetStatement | null}
   */
  parseLetStatement() {
    const stmt = new LetStatement(this.curToken);

    if (!this.expectPeek(TokenTypes.IDENT)) {
      return null;
    }

    stmt.name = new Identifier(this.curToken, this.curToken.literal);

    if (!this.expectPeek(TokenTypes.ASSIGN)) {
      return null;
    }

    // 跳过对表达式的处理，直到分号
    while (!this.curTokenIs(TokenTypes.SEMICOLON)) {
      this.nextToken();
    }

    return stmt;
  }

  /**
   * 前缀表达式解析器：Identifier
   * @returns {Identifier}
   */
  parseIdentifier() {
    return new Identifier(this.curToken, this.curToken.literal);
  }

  /**
   * 解析 return 语句。
   * @returns {ReturnStatement}
   */
  parseReturnStatement() {
    const stmt = new ReturnStatement(this.curToken);

    this.nextToken();

    // TODO：暂不处理表达式，跳过直到遇到分号
    while (!this.curTokenIs(TokenTypes.SEMICOLON)) {
      this.nextToken();
    }

    return stmt;
  }

  /**
   * 判断当前 token 是否为指定类型
   * @param {string} t
   * @returns {boolean}
   */
  curTokenIs(t) {
    return this.curToken.type === t;
  }

  /**
   * 判断下一个 token 是否为指定类型
   * @param {string} t
   * @returns {boolean}
   */
  peekTokenIs(t) {
    return this.peekToken.type === t;
  }

  /**
   * 如果下一个 token 是指定类型，就前进一格；否则记录错误
   * @param {string} t - 预期的 token 类型
   * @returns {boolean}
   */
  expectPeek(t) {
    if (this.peekTokenIs(t)) {
      this.nextToken();
      return true;
    } else {
      this.peekError(t);
      return false;
    }
  }
}
