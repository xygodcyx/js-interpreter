// lexer.js

import Token, { TokenTypes } from './token.js';

export default class Lexer {
  /**
   * @param {string} input - 要进行词法分析的源代码
   */
  constructor(input) {
    this.input = input;
    this.position = 0; // 当前字符的索引
    this.readPosition = 0; // 当前字符之后的索引
    this.ch = ''; // 当前正在查看的字符

    this.readChar(); // 初始化，读取第一个字符
  }

  /**
   * 读取下一个字符并更新状态
   */
  readChar() {
    if (this.readPosition >= this.input.length) {
      this.ch = null; // 表示 EOF
    } else {
      this.ch = this.input[this.readPosition];
    }
    this.position = this.readPosition;
    this.readPosition += 1;
  }

  /**
   * 返回当前的 Token，并推进到下一个字符
   */
  nextToken() {
    let tok;

    switch (this.ch) {
      case '=':
        tok = new Token(TokenTypes.ASSIGN, this.ch);
        break;
      case '+':
        tok = new Token(TokenTypes.PLUS, this.ch);
        break;
      case '(':
        tok = new Token(TokenTypes.LPAREN, this.ch);
        break;
      case ')':
        tok = new Token(TokenTypes.RPAREN, this.ch);
        break;
      case '{':
        tok = new Token(TokenTypes.LBRACE, this.ch);
        break;
      case '}':
        tok = new Token(TokenTypes.RBRACE, this.ch);
        break;
      case ',':
        tok = new Token(TokenTypes.COMMA, this.ch);
        break;
      case ';':
        tok = new Token(TokenTypes.SEMICOLON, this.ch);
        break;
      case null:
        tok = new Token(TokenTypes.EOF, '');
        break;
      default:
        tok = new Token(TokenTypes.ILLEGAL, this.ch);
    }

    this.readChar(); // 移动到下一个字符
    return tok;
  }
}
