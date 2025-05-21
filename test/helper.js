import { IntegerLiteral } from '../src/ast.js';
import Parser from '../src/parser.js';

/**
 * 检查解析器是否存在错误。如果有，则打印错误并中止测试。
 * @param {Parser} parser
 */
export function checkParserErrors(parser) {
  const errors = parser.Errors();
  if (errors.length === 0) return;

  console.error(`解析器共出现 ${errors.length} 个错误：`);
  for (const msg of errors) {
    console.error(`  解析器错误：${msg}`);
  }
  throw new Error('❌ 解析器存在错误，请检查日志输出');
}

/**
 * @param {Expression} exp - 要检查的表达式节点
 * @param {number} expected - 预期的整数值
 * @returns {boolean} - 是否测试通过
 */
export function testIntegerLiteral(exp, expected) {
  if (!exp || !(exp instanceof IntegerLiteral)) {
    console.error(`exp is not IntegerLiteral. got=${exp?.constructor?.name}`);
    return false;
  }

  if (exp.value !== expected) {
    console.error(`exp.value not ${expected}. got=${exp.value}`);
    return false;
  }

  if (exp.tokenLiteral() !== expected.toString()) {
    console.error(`exp.tokenLiteral not ${expected}. got=${exp.tokenLiteral()}`);
    return false;
  }

  return true;
}
