// HyperFrames Animation Controller — Impeccable Craft Edition
// Deterministic sequence controller for programmatic video recording

const cmdTextEl = document.getElementById('cmd-text');
const outputEl = document.getElementById('terminal-output');

const stepInstall = document.getElementById('step-install');
const stepAudit = document.getElementById('step-audit');
const stepDiff = document.getElementById('step-diff');
const stepRea = document.getElementById('step-rea');

function setActiveStep(el) {
  [stepInstall, stepAudit, stepDiff, stepRea].forEach(s => s?.classList.remove('active'));

  if (el) el.classList.add('active');
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function typeCommand(cmd, speed = 32) {
  cmdTextEl.textContent = '';

  for (let i = 0; i < cmd.length; i++) {
    cmdTextEl.textContent += cmd[i];
    await wait(speed);
  }
}

// Scene 1: Multi-Runtime 1-Command Deployment
async function scene1Install() {
  setActiveStep(stepInstall);
  outputEl.innerHTML = '';
  await typeCommand('npx discord-skill install', 28);
  await wait(240);

  outputEl.innerHTML = `
<span class="highlight-header">[INSTALL] discord-skill — Universal Multi-Runtime Installer</span>
<span class="text-dim">Deploying skill assets across detected AI coding runtimes...</span>

  <span class="text-emerald">✔ Antigravity / Gemini CLI</span>  : <span class="text-dim">~/.gemini/config/skills/discord-skill</span>
  <span class="text-emerald">✔ Claude Code</span>              : <span class="text-dim">~/.claude/skills/discord-skill</span>
  <span class="text-emerald">✔ Codex CLI</span>                : <span class="text-dim">~/.codex/skills/discord-skill</span>
  <span class="text-emerald">✔ Universal Agent Skills</span>    : <span class="text-dim">~/.agents/skills/discord-skill</span>

<span class="text-cyan">[READY] Skill deployed to 4 runtime environments in 1 command.</span>`;
  await wait(3600);
}

// Scene 2: 15-Package Protocol Audit
async function scene2Audit() {
  setActiveStep(stepAudit);
  outputEl.innerHTML = '';
  await typeCommand('npx discord-skill audit', 28);
  await wait(240);

  outputEl.innerHTML = `
<span class="highlight-header">[AUDIT] DISCORD.JS ECOSYSTEM MATRIX (15 MODULAR PACKAGES)</span>

┌─────────────────────────┬──────────────┬───────────┬─────────────────────────────────────────────────┐
│ Package                 │ Version      │ Role      │ Architectural Responsibility                    │
├─────────────────────────┼──────────────┼───────────┼─────────────────────────────────────────────────┤
│ <span class="text-blurple">discord.js</span>              │ 14.26.5      │ facade    │ OOP Facade & in-memory caching managers         │
│ <span class="text-cyan">discord-api-types</span>       │ 0.37.119     │ types     │ Canonical REST/Gateway specification (v9/v10)   │
│ <span class="text-emerald">@discordjs/core</span>         │ 2.6.0        │ network   │ Zero-overhead bot client (No-OOP RAM bottleneck)│
│ <span class="text-emerald">@discordjs/ws</span>           │ 2.0.4        │ gateway   │ Standalone WebSocket engine & auto-sharding     │
│ <span class="text-amber">@discordjs/voice</span>        │ 0.18.0       │ audio     │ Real-time WebRTC/UDP & Voice Receive pipeline   │
│ <span class="text-dim">... (10 more packages)</span>  │ ...          │ ...       │ brokers, proxy, builders, rpc, collection...    │
└─────────────────────────┴──────────────┴───────────┴─────────────────────────────────────────────────┘
<span class="text-emerald">✔ 113 REST Routes</span>   <span class="text-cyan">✔ 75 Gateway Events</span>   <span class="text-amber">✔ 36 Component Builders</span>`;
  await wait(4200);
}

// Scene 3: API Contract Drift Sentinel
async function scene3Diff() {
  setActiveStep(stepDiff);
  outputEl.innerHTML = '';
  await typeCommand('npx discord-skill diff ./package.json', 28);
  await wait(240);

  outputEl.innerHTML = `
<span class="text-dim">Auditing ./package.json dependencies against discord-skill baseline ledger...</span>

  <span class="text-emerald">✔ @discordjs/core</span>  : 2.6.0   <span class="text-dim">(100% aligned with baseline)</span>
  <span class="text-emerald">✔ @discordjs/rest</span>  : 2.6.3   <span class="text-dim">(100% aligned with baseline)</span>
  <span class="text-emerald">✔ discord.js</span>       : 14.26.5 <span class="text-dim">(100% aligned with baseline)</span>

<span class="text-cyan">[SENTINEL] Contract intact: No version drift or deprecated API routes detected.</span>`;
  await wait(3400);
}

// Scene 4: REA Reverse-Engineering Forensics
async function scene4Rea() {
  setActiveStep(stepRea);
  outputEl.innerHTML = '';
  await typeCommand('npx discord-skill rea', 28);
  await wait(240);

  outputEl.innerHTML = `
<span class="highlight-header">[LAB] REVERSE ENGINEERING TOOLKIT (REA SUITE INTEGRATION)</span>

<span class="text-amber">Policy Boundary:</span>  .agents/rules/discord-rea-boundary.md (ToS & No-Selfbot compliant)
<span class="text-cyan">Field Playbook:</span>   .agents/skills/discord-skill/references/rea-discord-investigations.md

  <span class="text-emerald">1. Electron ASAR</span>   : <span class="text-dim">rea analyze-javascript-application "&lt;core.asar&gt;" --json</span>
  <span class="text-emerald">2. C++ Native Addon</span>: <span class="text-dim">rea open-binary "&lt;voice.node&gt;" --provider ghidra</span>
  <span class="text-emerald">3. Semantic Diff</span>   : <span class="text-dim">rea compare-javascript-export-shapes --left &lt;v1&gt; --right &lt;v2&gt;</span>
  <span class="text-emerald">4. Passive CDP</span>     : <span class="text-dim">rea list-browser-targets (Discord Activities inspector)</span>`;
  await wait(4000);
}

// Loop forever for video recording
async function runLoop() {
  while (true) {
    await scene1Install();
    await scene2Audit();
    await scene3Diff();
    await scene4Rea();
  }
}

// Launch composition
runLoop();
