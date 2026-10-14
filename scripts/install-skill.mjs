#!/usr/bin/env node
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const SOURCE_SKILL_DIR = path.join(ROOT_DIR, '.agents', 'skills', 'discord-skill');

if (!fs.existsSync(SOURCE_SKILL_DIR)) {
  console.error(`❌ No se encontró la carpeta fuente de la skill en: ${SOURCE_SKILL_DIR}`);
  process.exit(1);
}

const homedir = os.homedir();

// Runtime target paths
const RUNTIMES = [
  {
    name: 'Antigravity / Gemini CLI (Global)',
    dir: path.join(homedir, '.gemini', 'config', 'skills', 'discord-skill'),
    parentCheck: path.join(homedir, '.gemini'),
  },
  {
    name: 'Claude Code',
    dir: path.join(homedir, '.claude', 'skills', 'discord-skill'),
    parentCheck: path.join(homedir, '.claude'),
  },
  {
    name: 'Codex CLI',
    dir: path.join(homedir, '.codex', 'skills', 'discord-skill'),
    parentCheck: path.join(homedir, '.codex'),
  },
  {
    name: 'Universal Agent Skills (~/.agents)',
    dir: path.join(homedir, '.agents', 'skills', 'discord-skill'),
    parentCheck: path.join(homedir),
  },
  {
    name: 'Local Workspace (.agents/skills)',
    dir: path.join(process.cwd(), '.agents', 'skills', 'discord-skill'),
    parentCheck: process.cwd(),
    skipIfSame: true,
  },
];

console.log(
  `\n🚀 [discord-skill] Instalador Unificado Multi-Runtime\n` +
  `Instalando skill en todos los entornos detectados (Codex, Claude Code, Gemini CLI, Antigravity)...\n`
);

let installedCount = 0;

for (const runtime of RUNTIMES) {
  if (runtime.skipIfSame && path.resolve(runtime.dir) === path.resolve(SOURCE_SKILL_DIR)) {
    continue;
  }

  try {
    const targetDir = runtime.dir;
    fs.mkdirSync(path.dirname(targetDir), { recursive: true });

    // Copiar archivos recursivamente
    fs.cpSync(SOURCE_SKILL_DIR, targetDir, { recursive: true, force: true });
    console.log(`  ✅ ${runtime.name}:`);
    console.log(`     -> ${targetDir}`);
    installedCount++;
  } catch (err) {
    console.warn(`  ⚠️  No se pudo instalar en ${runtime.name}: ${(err).message}`);
  }
}

console.log(
  `\n🎉 Instalación completada con éxito en ${installedCount} entorno(s).\n` +
  `Ahora puedes usar la skill directamente en tus prompts con cualquier agente.\n`
);
