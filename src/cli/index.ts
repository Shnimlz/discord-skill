#!/usr/bin/env node
import { parseArgs } from 'node:util';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DISCORD_ECOSYSTEM_PACKAGES } from '../core/registry.js';
import { extractDiscordRoutes } from '../extractors/routes.js';
import { extractGatewayEvents } from '../extractors/gateway.js';
import { extractBuilderComponents } from '../extractors/builders.js';
import { compareBaselines } from '../comparator/diff.js';
import type { PackageBaseline } from '../core/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../../');
const BASELINE_PATH = path.join(ROOT_DIR, 'baselines/baseline.json');

async function getBaseline(): Promise<PackageBaseline> {
  if (fs.existsSync(BASELINE_PATH)) {
    return JSON.parse(fs.readFileSync(BASELINE_PATH, 'utf-8'));
  }
  return generateBaseline();
}

async function generateBaseline(): Promise<PackageBaseline> {
  const routes = await extractDiscordRoutes();
  const gatewayEvents = await extractGatewayEvents();
  const builders = await extractBuilderComponents();

  const packages: Record<string, string> = {};
  for (const [k, v] of Object.entries(DISCORD_ECOSYSTEM_PACKAGES)) {
    packages[k] = v.version;
  }

  const baseline: PackageBaseline = {
    timestamp: new Date().toISOString(),
    packages,
    routes,
    gatewayEvents,
    builders,
  };

  const dir = path.dirname(BASELINE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(BASELINE_PATH, JSON.stringify(baseline, null, 2), 'utf-8');
  return baseline;
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'audit';

  console.log(`\n🤖 [discord-skill] CLI v1.0.0 — Discord Ecosystem Auditor\n`);

  if (command === 'audit') {
    console.log(`=== AUDITORÍA DEL ECOSISTEMA DISCORD.JS ===\n`);
    console.table(
      Object.values(DISCORD_ECOSYSTEM_PACKAGES).map((p) => ({
        Package: p.name,
        Version: p.version,
        Role: p.role,
        Description: p.description,
      }))
    );

    const routes = await extractDiscordRoutes();
    const events = await extractGatewayEvents();
    const builders = await extractBuilderComponents();

    console.log(`\nResumen de Métricas de Protocolo:`);
    console.log(`  • Rutas REST registradas: ${routes.length}`);
    console.log(`  • Eventos Gateway disponibles: ${events.length}`);
    console.log(`  • Component Builders activos: ${builders.length}`);
    console.log(`\nUsa 'discord-skill baseline' para congelar el estado actual.`);
    return;
  }

  if (command === 'baseline') {
    console.log(`Generando línea base (baseline) en: ${BASELINE_PATH}`);
    const baseline = await generateBaseline();
    console.log(`✅ Baseline guardado con éxito (${Object.keys(baseline.packages).length} paquetes).`);
    return;
  }

  if (command === 'diff') {
    const targetPath = args[1] || './package.json';
    const resolvedPath = path.resolve(process.cwd(), targetPath);

    if (!fs.existsSync(resolvedPath)) {
      console.error(`❌ No se encontró el archivo: ${resolvedPath}`);
      process.exit(1);
    }

    const targetPkgJson = JSON.parse(fs.readFileSync(resolvedPath, 'utf-8'));
    const dependencies = {
      ...(targetPkgJson.dependencies || {}),
      ...(targetPkgJson.devDependencies || {}),
    };

    const baseline = await getBaseline();
    console.log(`Comparando dependencias en ${targetPath} contra la línea base de discord-skill...\n`);

    let driftFound = false;
    for (const [pkg, targetVer] of Object.entries(dependencies)) {
      const cleanVer = (targetVer as string).replace(/[\^~]/g, '');
      const baseVer = baseline.packages[pkg];

      if (baseVer) {
        if (baseVer !== cleanVer) {
          driftFound = true;
          console.log(`⚠️  DRIFT DETECTADO en '${pkg}':`);
          console.log(`    Baseline skill: ${baseVer}`);
          console.log(`    Target project: ${cleanVer}`);
        } else {
          console.log(`✅ '${pkg}' está perfectamente alineado (${cleanVer})`);
        }
      }
    }

    if (!driftFound) {
      console.log(`\n🎉 Todas las dependencias auditadas están alineadas con la línea base.`);
    } else {
      console.log(`\nPuedes ejecutar 'discord-skill update <paquete>' para actualizar la línea base.`);
    }
    return;
  }

  if (command === 'update') {
    const pkgName = args[1];
    if (!pkgName) {
      console.error(`❌ Debes especificar el nombre del paquete. Ejemplo: discord-skill update discord.js`);
      process.exit(1);
    }

    const baseline = await getBaseline();
    console.log(`Buscando actualización para '${pkgName}'...`);
    console.log(`Versión actual en baseline: ${baseline.packages[pkgName] || 'No registrado'}`);
    console.log(`💡 Para sincronizar con el proyecto actual, ejecuta 'discord-skill baseline'.`);
    return;
  }

  console.log(`Comandos disponibles:`);
  console.log(`  audit     - Muestra el estado del ecosistema y componentes`);
  console.log(`  baseline  - Congela el catálogo de rutas, eventos y versiones`);
  console.log(`  diff      - Compara un package.json contra el baseline`);
  console.log(`  update    - Inspecciona y actualiza un paquete específico`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
