// parser.test.js

import Lexer from '../src/lexer.js';
import Parser from '../src/parser.js';
import { ExpressionStatement, PrefixExpression } from '../src/ast.js';
import { testLiteralExpression } from './helper.js';

/**
 * 测试整数文字表达式解析是否正确。
 */
function testParsingPrefixExpressions() {
  const tests = [
    { input: '!5;', operator: '!', integerValue: 5 },
    { input: '-15;', operator: '-', integerValue: 15 },
    { input: '!true;', operator: '!', integerValue: true },
    { input: '!false;', operator: '!', integerValue: false },
  ];

  for (const { input, operator, integerValue } of tests) {
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    const program = parser.parseProgram();
    const errors = parser.errors;

    console.assert(errors.length === 0, `parser has errors: ${errors.join(', ')}`);
    console.assert(
      program.statements.length === 1,
      `program.statements does not contain 1 statement. got=${program.statements.length}`
    );

    const stmt = program.statements[0];
    console.assert(
      stmt instanceof ExpressionStatement,
      `stmt is not ExpressionStatement. got=${stmt.constructor.name}`
    );

    const exp = stmt.expression;
    console.assert(
      exp instanceof PrefixExpression,
      `stmt.expression is not PrefixExpression. got=${exp.constructor.name}`
    );

    console.assert(
      exp.operator === operator,
      `exp.operator is not '${operator}'. got='${exp.operator}'`
    );

    console.assert(
      testLiteralExpression(console, exp.right, integerValue),
      `exp.right is not integer literal with value ${integerValue}`
    );
  }
  console.log('✅ testParsingPrefixExpressions 测试通过！');
}

// ✅ 执行测试
testParsingPrefixExpressions();
