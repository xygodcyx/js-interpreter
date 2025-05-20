import { glob } from 'glob';
import { execSync } from 'child_process';

const testFiles = glob.sync('test/**/*.test.js');
testFiles.forEach(file => {
  console.log(`>> Running test: ${file}`);
  try {
    execSync(`node ${file}`, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Test failed: ${file}`);
    console.error(error.message);
  }
});
