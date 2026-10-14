// HyperFrames Video Composition Controller
// Simulates live terminal interactions and deterministic frame animations

const cmdTextEl = document.getElementById('cmd-text');
const outputEl = document.getElementById('terminal-output');

const featInstall = document.getElementById('f-install');
const featAudit = document.getElementById('f-audit');
const featDiff = document.getElementById('f-diff');
const featRea = document.getElementById('f-rea');

function setActiveFeature(el) {
  [featInstall, featAudit, featDiff, featRea].forEach(f => f.classList.remove('active'));
  if (el) el.classList.add('active');
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function typeCommand(cmd, speed = 40) {
  cmdTextEl.textContent = '';
  for (let i = 0; i < cmd.length; i++) {
    cmdTextEl.textContent += cmd[i];
    await wait(speed);
  }
}

// Scenarios / Scenes
async function scene1Install() {
  setActiveFeature(featInstall);
  outputEl.innerHTML = '';
  await typeCommand('npx discord-skill install', 35);
  await wait(300);

  outputEl.innerHTML = `
<span class="text-blurple">🚀 [discord-skill] Instalador Unificado Multi-Runtime</span>
Instalando skill en todos los entornos detectados (Codex, Claude, Gemini, Antigravity)...

  <span class="text-green">✔ Antigravity / Gemini CLI</span> : ~/.gemini/config/skills/discord-skill
  <span class="text-green">✔ Claude Code</span>             : ~/.claude/skills/discord-skill
  <span class="text-green">✔ Codex CLI</span>               : ~/.codex/skills/discord-skill
  <span class="text-green">✔ Universal Agent Skills</span>   : ~/.agents/skills/discord-skill

<span class="text-cyan">🎉 Instalación completada con éxito en 4 entornos con un solo comando.</span>`;
  await wait(3200);
}

async function scene2Audit() {
  setActiveFeature(featAudit);
  outputEl.innerHTML = '';
  await typeCommand('npx discord-skill audit', 35);
  await wait(300);

  outputEl.innerHTML = `
<span class="text-blurple">=== AUDITORÍA DEL ECOSISTEMA DISCORD.JS (15 PAQUETES) ===</span>

┌─────────┬─────────────────────────┬──────────────┬───────────┐
│ (index) │ Package                 │ Version      │ Role      │
├─────────┼─────────────────────────┼──────────────┼───────────┤
│ 0       │ 'discord.js'            │ '14.26.5'    │ 'facade'  │
│ 1       │ 'discord-api-types'     │ '0.37.119'   │ 'types'   │
│ 2       │ '@discordjs/core'       │ '2.6.0'      │ 'network' │
│ 3       │ '@discordjs/rest'       │ '2.6.3'      │ 'network' │
│ 4       │ '@discordjs/ws'         │ '2.0.4'      │ 'gateway' │
│ 5       │ '@discordjs/builders'   │ '1.11.0'     │ 'ui'      │
│ 6       │ '@discordjs/voice'      │ '0.18.0'     │ 'audio'   │
│ ...     │ 8 paquetes adicionales  │ ...          │ ...       │
└─────────┴─────────────────────────┴──────────────┴───────────┘
<span class="text-green">✔ 113 Rutas REST Registradas</span>  •  <span class="text-cyan">✔ 75 Eventos Gateway</span>  •  <span class="text-amber">✔ 36 Component Builders</span>`;
  await wait(3500);
}

async function scene3Diff() {
  setActiveFeature(featDiff);
  outputEl.innerHTML = '';
  await typeCommand('npx discord-skill diff ./package.json', 35);
  await wait(300);

  outputEl.innerHTML = `
<span class="text-muted">Comparando dependencias en ./package.json contra la línea base de discord-skill...</span>

  <span class="text-green">✔ '@discordjs/core'</span> está perfectamente alineado (2.6.0)
  <span class="text-green">✔ '@discordjs/rest'</span> está perfectamente alineado (2.6.3)
  <span class="text-green">✔ 'discord.js'</span>      está perfectamente alineado (14.26.5)

<span class="text-cyan">🎉 Todas las dependencias auditadas están alineadas con la línea base.</span>`;
  await wait(3000);
}

async function scene4Rea() {
  setActiveFeature(featRea);
  outputEl.innerHTML = '';
  await typeCommand('npx discord-skill rea', 35);
  await wait(300);

  outputEl.innerHTML = `
<span class="text-blurple">=== MÓDULO DE INGENIERÍA INVERSA (REA INTEGRATION) ===</span>

<span class="text-amber">🛡️ Reglas y Límites:</span> .agents/rules/discord-rea-boundary.md
<span class="text-cyan">📚 Guía Técnica:</span>     .agents/skills/discord-skill/references/rea-discord-investigations.md

  <span class="text-green">1. ASAR Electron:</span>  rea analyze-javascript-application "&lt;core.asar&gt;"
  <span class="text-green">2. Addons C++:</span>     rea open-binary "&lt;voice.node&gt;" --provider ghidra
  <span class="text-green">3. Shape Diff:</span>     rea compare-javascript-export-shapes --left &lt;v1&gt; --right &lt;v2&gt;
  <span class="text-green">4. CDP Pasivo:</span>     rea list-browser-targets (Discord Activities)`;
  await wait(3500);
}

async function loop() {
  while (true) {
    await scene1Install();
    await scene2Audit();
    await scene3Diff();
    await scene4Rea();
  }
}

// Start animation loop
loop();
