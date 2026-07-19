import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const applicationDirectory = resolve(scriptDirectory, '..');
const repositoryDirectory = resolve(applicationDirectory, '..', '..');
const sourcePath = resolve(repositoryDirectory, 'MagicCompRules.pdf');
const outputDirectory = resolve(applicationDirectory, 'src', 'assets', 'rules');
const indexPath = resolve(outputDirectory, 'rules-index.json');
const pdfPath = resolve(outputDirectory, 'MagicCompRules.pdf');
const ruleStart = /(?=\b\d{3}\.\d+(?:[a-z])?\.?\s)/g;
const ruleId = /^(\d{3}\.\d+(?:[a-z])?)\.?\s*/;

const normalizeWhitespace = (value) => value.replace(/\s+/g, ' ').trim();

const getTitle = (text, id) => {
  const remaining = text.replace(new RegExp(`^${id.replace('.', '\\.')}(?:\\.)?\\s*`), '');
  const title = remaining.match(/^([A-Z][A-Za-z'’\- ]{2,80}?)(?=\d{3}\.\d|\.|$)/)?.[1]?.trim();
  return title ?? `Rule ${id}`;
};

const source = await readFile(sourcePath);
const pdf = await getDocument({ data: new Uint8Array(source) }).promise;
const rules = [];

for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
  const page = await pdf.getPage(pageNumber);
  const content = await page.getTextContent();
  const pageText = normalizeWhitespace(content.items.map((item) => item.str).join(''));
  const segments = pageText.split(ruleStart).map(normalizeWhitespace).filter(Boolean);

  for (const segment of segments) {
    const match = segment.match(ruleId);
    if (!match) continue;

    const id = match[1];
    const previous = rules.at(-1);
    if (previous?.id === id && previous.page === pageNumber) {
      previous.text = normalizeWhitespace(`${previous.text} ${segment}`);
      continue;
    }

    rules.push({
      id,
      title: getTitle(segment, id),
      text: segment,
      page: pageNumber,
    });
  }
}

if (rules.length === 0) {
  throw new Error('No numbered rules were extracted from MagicCompRules.pdf.');
}

await mkdir(outputDirectory, { recursive: true });
await copyFile(sourcePath, pdfPath);
await writeFile(indexPath, `${JSON.stringify({
  metadata: {
    sourceFile: 'MagicCompRules.pdf',
    effectiveDate: '2026-02-27',
    totalPages: pdf.numPages,
    totalRules: rules.length,
  },
  rules,
}, null, 2)}\n`);

console.log(`Indexed ${rules.length} rules from ${pdf.numPages} pages.`);
