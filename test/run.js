import { glob } from 'glob';
import { execSync } from 'child_process';

const testFiles = glob.sync('test/**/*.test.js');

testFiles.forEach(file => {
  console.log(`Running test: ${file}`);
  execSync(`node ${file}`, { stdio: 'inherit' });
});
