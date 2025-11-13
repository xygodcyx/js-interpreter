// lexer.test.js

import { TokenTypes } from '../src/token.js'; // 假设你已定义了 token 类型常量
import Lexer from '../src/lexer.js'; // 你将要实现的词法分析器

function testNextTokenBasicSymbols() {
    const input = `let five = 5;
let ten = 10;

let add = fn(x, y) {
   x + y;
};

let result = add(five, ten);
!+-*/
5>3 3<5

if (5 < 10) {
    return true;
} else {
    return false;
}

10 == 10
9 != 10

"foobar"
"foo bar"

[1,2];
while
`;

    const tests = [
        { expectedType: TokenTypes.LET, expectedLiteral: 'let' },
        { expectedType: TokenTypes.IDENT, expectedLiteral: 'five' },
        { expectedType: TokenTypes.ASSIGN, expectedLiteral: '=' },
        { expectedType: TokenTypes.INT, expectedLiteral: '5' },
        { expectedType: TokenTypes.SEMICOLON, expectedLiteral: ';' },

        { expectedType: TokenTypes.LET, expectedLiteral: 'let' },
        { expectedType: TokenTypes.IDENT, expectedLiteral: 'ten' },
        { expectedType: TokenTypes.ASSIGN, expectedLiteral: '=' },
        { expectedType: TokenTypes.INT, expectedLiteral: '10' },
        { expectedType: TokenTypes.SEMICOLON, expectedLiteral: ';' },

        { expectedType: TokenTypes.LET, expectedLiteral: 'let' },
        { expectedType: TokenTypes.IDENT, expectedLiteral: 'add' },
        { expectedType: TokenTypes.ASSIGN, expectedLiteral: '=' },
        { expectedType: TokenTypes.FUNCTION, expectedLiteral: 'fn' },
        { expectedType: TokenTypes.LPAREN, expectedLiteral: '(' },
        { expectedType: TokenTypes.IDENT, expectedLiteral: 'x' },
        { expectedType: TokenTypes.COMMA, expectedLiteral: ',' },
        { expectedType: TokenTypes.IDENT, expectedLiteral: 'y' },
        { expectedType: TokenTypes.RPAREN, expectedLiteral: ')' },
        { expectedType: TokenTypes.LBRACE, expectedLiteral: '{' },
        { expectedType: TokenTypes.IDENT, expectedLiteral: 'x' },
        { expectedType: TokenTypes.PLUS, expectedLiteral: '+' },
        { expectedType: TokenTypes.IDENT, expectedLiteral: 'y' },
        { expectedType: TokenTypes.SEMICOLON, expectedLiteral: ';' },
        { expectedType: TokenTypes.RBRACE, expectedLiteral: '}' },
        { expectedType: TokenTypes.SEMICOLON, expectedLiteral: ';' },

        { expectedType: TokenTypes.LET, expectedLiteral: 'let' },
        { expectedType: TokenTypes.IDENT, expectedLiteral: 'result' },
        { expectedType: TokenTypes.ASSIGN, expectedLiteral: '=' },
        { expectedType: TokenTypes.IDENT, expectedLiteral: 'add' },
        { expectedType: TokenTypes.LPAREN, expectedLiteral: '(' },
        { expectedType: TokenTypes.IDENT, expectedLiteral: 'five' },
        { expectedType: TokenTypes.COMMA, expectedLiteral: ',' },
        { expectedType: TokenTypes.IDENT, expectedLiteral: 'ten' },
        { expectedType: TokenTypes.RPAREN, expectedLiteral: ')' },
        { expectedType: TokenTypes.SEMICOLON, expectedLiteral: ';' },

        { expectedType: TokenTypes.BANG, expectedLiteral: '!' },
        { expectedType: TokenTypes.PLUS, expectedLiteral: '+' },
        { expectedType: TokenTypes.MINUS, expectedLiteral: '-' },
        { expectedType: TokenTypes.ASTERISK, expectedLiteral: '*' },
        { expectedType: TokenTypes.SLASH, expectedLiteral: '/' },

        { expectedType: TokenTypes.INT, expectedLiteral: '5' },
        { expectedType: TokenTypes.GT, expectedLiteral: '>' },
        { expectedType: TokenTypes.INT, expectedLiteral: '3' },

        { expectedType: TokenTypes.INT, expectedLiteral: '3' },
        { expectedType: TokenTypes.LT, expectedLiteral: '<' },
        { expectedType: TokenTypes.INT, expectedLiteral: '5' },

        { expectedType: TokenTypes.IF, expectedLiteral: 'if' },
        { expectedType: TokenTypes.LPAREN, expectedLiteral: '(' },
        { expectedType: TokenTypes.INT, expectedLiteral: '5' },
        { expectedType: TokenTypes.LT, expectedLiteral: '<' },
        { expectedType: TokenTypes.INT, expectedLiteral: '10' },
        { expectedType: TokenTypes.RPAREN, expectedLiteral: ')' },
        { expectedType: TokenTypes.LBRACE, expectedLiteral: '{' },
        { expectedType: TokenTypes.RETURN, expectedLiteral: 'return' },
        { expectedType: TokenTypes.TRUE, expectedLiteral: 'true' },
        { expectedType: TokenTypes.SEMICOLON, expectedLiteral: ';' },
        { expectedType: TokenTypes.RBRACE, expectedLiteral: '}' },
        { expectedType: TokenTypes.ELSE, expectedLiteral: 'else' },
        { expectedType: TokenTypes.LBRACE, expectedLiteral: '{' },
        { expectedType: TokenTypes.RETURN, expectedLiteral: 'return' },
        { expectedType: TokenTypes.FALSE, expectedLiteral: 'false' },
        { expectedType: TokenTypes.SEMICOLON, expectedLiteral: ';' },
        { expectedType: TokenTypes.RBRACE, expectedLiteral: '}' },

        { expectedType: TokenTypes.INT, expectedLiteral: '10' },
        { expectedType: TokenTypes.EQ, expectedLiteral: '==' },
        { expectedType: TokenTypes.INT, expectedLiteral: '10' },

        { expectedType: TokenTypes.INT, expectedLiteral: '9' },
        { expectedType: TokenTypes.NOT_EQ, expectedLiteral: '!=' },
        { expectedType: TokenTypes.INT, expectedLiteral: '10' },

        { expectedType: TokenTypes.STRING, expectedLiteral: 'foobar' },
        { expectedType: TokenTypes.STRING, expectedLiteral: 'foo bar' },

        { expectedType: TokenTypes.LBRACKET, expectedLiteral: '[' },
        { expectedType: TokenTypes.INT, expectedLiteral: '1' },
        { expectedType: TokenTypes.COMMA, expectedLiteral: ',' },
        { expectedType: TokenTypes.INT, expectedLiteral: '2' },
        { expectedType: TokenTypes.RBRACKET, expectedLiteral: ']' },
        { expectedType: TokenTypes.SEMICOLON, expectedLiteral: ';' },

        { expectedType: TokenTypes.WHILE, expectedLiteral: 'while' },

        { expectedType: TokenTypes.EOF, expectedLiteral: '' },
    ];

    const lexer = new Lexer(input);
    tests.forEach((tt, i) => {
        const tok = lexer.nextToken();

        console.assert(
            tok.type === tt.expectedType,
            `Test ${i}: expected type ${tt.expectedType}, got ${tok.type}`
        );

        console.assert(
            tok.literal === tt.expectedLiteral,
            `Test ${i}: expected literal "${tt.expectedLiteral}", got "${tok.literal}"`
        );
    });

    console.log('✅ testNextTokenBasicSymbols passed!');
}

// 调用测试函数
testNextTokenBasicSymbols();
