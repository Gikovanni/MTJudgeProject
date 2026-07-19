import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const applicationDirectory = resolve(fileURLToPath(new URL('..', import.meta.url)));
const indexPath = resolve(applicationDirectory, 'src', 'assets', 'rules', 'rules-index.json');
const database = JSON.parse(await readFile(indexPath, 'utf8'));

if (!Array.isArray(database.rules) || database.rules.length < 1000) {
  throw new Error('Rules index is missing or unexpectedly small.');
}

for (const rule of database.rules) {
  if (!rule.id || !rule.text || !Number.isInteger(rule.page) || rule.page < 1) {
    throw new Error(`Invalid rule entry: ${JSON.stringify(rule)}`);
  }
}

console.log(`Validated ${database.rules.length} indexed rules.`);
