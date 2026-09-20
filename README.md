# Js-Interpreter

使用 JavaScript 实现的 [Monkey 编程语言](https://monkeylang.org/) 解释器，遵循 Thorsten Ball 的经典著作《Writing an Interpreter in Go》的设计思路，在 Node.js 环境下完整实现了词法分析、语法解析、AST 求值与 REPL 交互。

## 功能特性

- **词法分析**：将源代码字符串解析为 Token 序列
- **语法解析**：基于 Pratt 解析器生成抽象语法树
- **树遍历求值**：直接遍历 AST 节点进行求值
- **对象系统**：完整的运行时对象体系（整数、字符串、布尔、数组、函数、内置函数等）
- **函数与闭包**：支持函数定义、调用及闭包捕获
- **REPL 交互**：内置命令行交互环境，支持逐行输入即时求值

## 项目结构

```
js-interpreter/
├── src/
│   ├── lexer.js          # 词法分析器
│   ├── parser.js         # 语法解析器
│   ├── ast.js            # AST 节点定义
│   ├── evaluator.js      # 求值器
│   ├── object.js         # 运行时对象系统
│   ├── environment.js    # 作用域环境
│   ├── builtins.js       # 内置函数
│   ├── token.js          # Token 类型定义
│   ├── repl.js           # REPL 入口
│   └── main.js           # 程序入口
├── test/                 # 测试用例
├── bin/                  # 可执行脚本
├── code/                 # 示例代码
└── package.json
```

## 快速开始

### 环境要求

- Node.js >= 20.1
- npm 或 bun

### 安装

```bash
git clone https://github.com/xygodcyx/js-interpreter.git
cd js-interpreter
npm install
```

### 运行 REPL

```bash
node src/main.js
```

启动后进入交互环境，直接输入 Monkey 代码即可：

```
>> let x = 5;
>> let y = x * 2;
>> y
10
```

### 运行示例文件

```bash
node src/main.js examples/hello.monkey
```

## 语言示例

### 变量与表达式

```monkey
let name = "Monkey";
let age = 1;
let result = (10 + 5) * 2 - 3;
```

### 函数与闭包

```monkey
let add = fn(a, b) { a + b; };
let result = add(3, 7);

let newAdder = fn(x) {
  fn(y) { x + y; };
};
let addTwo = newAdder(2);
addTwo(3);  // 5
```

### 条件与循环

```monkey
let max = fn(a, b) {
  if (a > b) {
    a;
  } else {
    b;
  }
};

let i = 0;
while (i < 10) {
  i = i + 1;
}
```

### 数组与内置函数

```monkey
let arr = [1, 2, 3];
let len = length(arr);      // 3
let first = first(arr);     // 1
let last = last(arr);       // 3
let rest = rest(arr);       // [2, 3]
let pushed = push(arr, 4);  // [1, 2, 3, 4]
```

## 技术亮点

**异步求值架构**。求值器 `Eval` 函数采用 `async/await` 设计，所有求值路径均为异步，为后续扩展异步内置函数（如网络请求、定时器等）预留了空间。

**统一的错误处理**。通过 `ErrorObject` 和 `isError` 辅助函数实现错误对象沿调用链的自动传播，求值过程中任何步骤产生错误都会立即向上返回，避免冗余的错误检查逻辑。

**环境链式作用域**。`Environment` 通过 `outer` 指针实现作用域链，支持 `newEnclosedEnvironment` 创建嵌套作用域，函数调用时自动捕获定义时的环境形成闭包。

**对象系统**。`object.js` 中定义了 `BaseObject` 基类及 `IntegerObj`、`StringObj`、`BooleanObj`、`ArrayObject`、`FunctionObject`、`BuiltinObject` 等子类，每个对象实现 `Type()` 和 `Inspect()` 方法，形成清晰的运行时类型体系。

## 测试

```bash
npm test
```

测试目录包含词法分析、语法解析、求值等各阶段的单元测试。

## 参考资料

- [Writing an Interpreter in Go](https://interpreterbook.com/) — Thorsten Ball
- [Monkey 语言官方站点](https://monkeylang.org/)
- [Monkey 语言规范](https://github.com/skx/monkey)

## License

MIT
