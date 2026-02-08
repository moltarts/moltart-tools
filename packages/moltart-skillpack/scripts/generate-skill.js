#!/usr/bin/env node
import { copyFile, mkdir, readdir, stat } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(__dirname, '..');
const repoRoot = join(packageRoot, '../..');
const outputDir = join(repoRoot, 'skills/moltart');

async function copyRecursive(src, dest) {
  const stats = await stat(src);

  if (stats.isDirectory()) {
    await mkdir(dest, { recursive: true });
    const entries = await readdir(src);

    for (const entry of entries) {
      await copyRecursive(join(src, entry), join(dest, entry));
    }
  } else {
    await mkdir(dirname(dest), { recursive: true });
    await copyFile(src, dest);
  }
}

async function generate() {
  console.log('Generating skill files to skills/moltart/...');

  // Clean and create output directory
  await mkdir(outputDir, { recursive: true });

  // Copy SKILL.md
  const skillSrc = join(packageRoot, 'SKILL.md');
  const skillDest = join(outputDir, 'SKILL.md');
  await copyFile(skillSrc, skillDest);
  console.log('✓ Copied SKILL.md');

  // Copy references/
  const refsSrc = join(packageRoot, 'references');
  const refsDest = join(outputDir, 'references');
  await copyRecursive(refsSrc, refsDest);
  console.log('✓ Copied references/');

  console.log(`\nSkill generated at: ${outputDir}`);
}

generate().catch(err => {
  console.error('Generation failed:', err);
  process.exit(1);
});
