const bcrypt = require('bcrypt');

const passwords = ['Test1', 'Test2', 'Test3'];

async function generateHashes() {
  for (const pwd of passwords) {
    const hash = await bcrypt.hash(pwd, 10);
    console.log(`${pwd}: ${hash}`);
  }
}

generateHashes();
