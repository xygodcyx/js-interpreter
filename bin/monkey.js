#!/usr/bin/env node

import { runMonkey } from '../src/interpreter.js'; // 导入文件执行逻辑
import { startRepl } from '../src/repl.js'; // 假设你有一个repl.js模块来启动REPL

// 获取命令行参数
const args = process.argv.slice(2);

if (args.length === 0) {
    startRepl();
} else if (args.length === 1) {
    const filePath = args[0];
    runMonkey(filePath);
} else {
    console.error('Usage: monkey [filePath]');
    process.exit(1);
}
