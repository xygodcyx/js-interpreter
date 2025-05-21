// parser.test.js

import Lexer from '../src/lexer.js';
import Parser from '../src/parser.js';
import { ExpressionStatement, InfixExpression } from '../src/ast.js';
import { checkParserErrors, testIntegerLiteral } from './helper.js';

/**
 * 测试中缀表达式解析是否正确。
 */
function testParsingInfixExpressions() {
  const tests = [
    { input: '5 + 5;', leftValue: 5, operator: '+', rightValue: 5 },
    { input: '5 - 5;', leftValue: 5, operator: '-', rightValue: 5 },
    { input: '5 * 5;', leftValue: 5, operator: '*', rightValue: 5 },
    { input: '5 / 5;', leftValue: 5, operator: '/', rightValue: 5 },
    { input: '5 > 5;', leftValue: 5, operator: '>', rightValue: 5 },
    { input: '5 < 5;', leftValue: 5, operator: '<', rightValue: 5 },
    { input: '5 == 5;', leftValue: 5, operator: '==', rightValue: 5 },
    { input: '5 != 5;', leftValue: 5, operator: '!=', rightValue: 5 },
  ];

  for (const { input, leftValue, operator, rightValue } of tests) {
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);
    const program = parser.parseProgram();
    checkParserErrors(parser);

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
      exp instanceof InfixExpression,
      `stmt.expression is not InfixExpression. got=${exp.constructor.name}`
    );

    console.assert(
      testIntegerLiteral(exp.left, leftValue),
      `exp.left is not IntegerLiteral(${leftValue})`
    );

    console.assert(
      exp.operator === operator,
      `exp.operator is not '${operator}'. got='${exp.operator}'`
    );

    console.assert(
      testIntegerLiteral(exp.right, rightValue),
      `exp.right is not IntegerLiteral(${rightValue})`
    );
  }

  console.log('✅ testParsingInfixExpressions 测试通过！');
}

testParsingInfixExpressions();
