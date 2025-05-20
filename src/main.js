// main.js
import os from 'node:os';
import { startRepl } from './repl.js';

function main() {
  const userInfo = os.userInfo();
  console.log(`Hello ${userInfo.username}! This is the Monkey programming language!`);
  console.log('Feel free to type in commands');

  startRepl(); // 这里调用 REPL
}

main();
