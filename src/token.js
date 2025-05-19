export const TokenTypes = {
  // 特殊标识
  ILLEGAL: 'ILLEGAL',
  EOF: 'EOF',

  // 标识符 + 字面量
  IDENT: 'IDENT', // add, foobar, x, y, ...
  INT: 'INT', // 1343456

  // 运算符
  ASSIGN: '=',
  PLUS: '+',

  // 分隔符
  COMMA: ',',
  SEMICOLON: ';',

  LPAREN: '(',
  RPAREN: ')',
  LBRACE: '{',
  RBRACE: '}',

  // 关键字
  FUNCTION: 'FUNCTION',
  LET: 'LET',
};

export default class Token {
  /**
   * @param {string} type - token 的类型，如 IDENT、INT 等
   * @param {string} literal - token 的字面值
   */
  constructor(type, literal) {
    this.type = type;
    this.literal = literal;
  }
}
