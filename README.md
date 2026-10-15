<div align="center">

# 🤖 discord-skill

**The Agent Skill and audit CLI for the entire discord.js ecosystem.**
Pick the right package, build zero-overhead bots, and catch Discord API contract drift before it breaks production.

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![pnpm](https://img.shields.io/badge/pnpm-workspace-F69220?logo=pnpm&logoColor=white)](https://pnpm.io/)
[![discord.js](https://img.shields.io/badge/discord.js-14-5865F2?logo=discord&logoColor=white)](https://discord.js.org)
[![Agent Skill](https://img.shields.io/badge/Agent%20Skill-cross--runtime-orange)](#-quick-start)
[![Stars](https://img.shields.io/github/stars/Shnimlz/discord-skill?style=flat&logo=github)](https://github.com/Shnimlz/discord-skill/stargazers)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

[**Quick Start**](#-quick-start) · [**Why**](#-why-discord-skill) · [**Choosing a Package**](#-choosing-the-right-package) · [**CLI**](#-cli-reference) · [**Knowledge Base**](#-knowledge-base) · [**Contributing**](#-contributing)

<img src="assets/demo.gif" alt="discord-skill demo" width="720">

</div>


## 🤔 Why discord-skill?

discord.js is not one library: it is a monorepo of **15 packages**. Yet most tutorials, and most AI assistants, reach for the full `discord.js` monolith every time. That leads to three recurring problems:

| Problem | What happens |
| --- | --- |
| **Wrong tool for the job** | A 30 MB bot becomes a 300 MB bot because nobody told you `@discordjs/core` existed. |
| **Stale knowledge** | Tutorials lag behind Discord's API; new routes and flags show up months before they are documented. |
| **Silent contract drift** | A dependency bump changes a payload or enum and nothing fails until production. |

`discord-skill` ships two things to fix that:

- 🧠 **An Agent Skill** that teaches your AI coding agent the whole ecosystem: architecture, low-level patterns, voice, interaction resilience and safety boundaries.
- 🛠️ **An audit CLI** that inspects the ecosystem and compares your project's dependencies against a frozen baseline so you can detect drift.


## ✨ Features

| 🧠 For AI agents | 🛠️ For developers |
| --- | --- |
| Package-selection matrix: never default to the monolith | `audit`: full catalog of components and protocol metrics |
| Zero-cache, low-level bot blueprints (`core` + `ws` + `rest`) | `diff`: compare your `package.json` against the baseline |
| Voice handshake and Voice Receive pipelines (Opus, STT) | `baseline`: freeze or refresh the reference snapshot |
| Interaction lifecycle patterns (3-second window, auto-defer) | `rea`: reverse-engineering lab for Discord investigations |
| Built-in safety invariants for bot tokens | One-command install across agent runtimes |


## 🚀 Quick Start

### Install the skill

Installs `discord-skill` into every supported agent environment found on your machine (**Codex**, **Claude Code**, **Gemini CLI** and **Antigravity**):

```bash
npx discord-skill install
```

Or through the standard agent-skills registry:

```bash
npx skills add Shnimlz/discord-skill
```

Any other agent that loads `SKILL.md`-style skills (for example Cursor) can use the skill file directly: [`.agents/skills/discord-skill/SKILL.md`](.agents/skills/discord-skill/SKILL.md).

### Run the CLI from source

```bash
git clone https://github.com/Shnimlz/discord-skill.git
cd discord-skill
pnpm install

pnpm cli audit
```


## 🧭 Choosing the Right Package

Never use the `discord.js` monolith by default. Pick the component that matches the requirement:

| Requirement | Package | Why |
| --- | --- | --- |
| High concurrency / memory-critical | `@discordjs/core` + `@discordjs/ws` | No OOP overhead: no `Guild`, `Message` or `User` instances, just plain JSON. |
| Microservices / distributed sharding | `@discordjs/brokers` | Decouples Gateway intake from business logic through queues (RabbitMQ, Kafka, Redis). |
| Shared global rate limiting | `@discordjs/proxy` | Standalone HTTP service that centralizes bucket queues across processes or containers. |
| Serverless / pure HTTP endpoints | `@discordjs/rest` | Direct HTTP calls with Ed25519 signature verification (Cloudflare Workers, AWS Lambda). |
| Real-time voice (Tx / Rx) | `@discordjs/voice` | UDP voice protocol, ChaCha20 / XSalsa20 encryption, Opus decoding and Voice Receive streams. |
| Slash commands and UI components | `@discordjs/builders` | Typed builders for commands, subcommands, action rows, modals and select menus. |
| Canonical specs and bit flags | `discord-api-types` | Gateway event names, bit flags and REST payload types for API v9/v10. |
| Fast monolith / prototyping | `discord.js` | In-memory cache, automatic managers and classic collections. |

---

## 📦 Ecosystem Coverage

All 15 packages of the ecosystem are covered:

| Package | Role |
| --- | --- |
| `discord.js` | Main facade with in-memory cache and collection managers |
| `discord-api-types` | Canonical types, enums and payloads for the Discord API (v9/v10) |
| `@discordjs/core` | Ultra-light, zero-overhead bot client |
| `@discordjs/ws` | Standalone Gateway WebSocket engine with auto-sharding and heartbeats |
| `@discordjs/rest` | HTTP engine with strict per-bucket rate-limit handling |
| `@discordjs/builders` | Typed builders for slash commands, embeds, modals and action rows |
| `@discordjs/voice` | Voice protocol, encryption and audio pipelines |
| `@discordjs/brokers` | Inter-process communication for distributed architectures |
| `@discordjs/proxy` | HTTP proxy that centralizes rate limits across processes |
| `@discordjs/collection` | Extended `Map` and LRU sweepers |
| `@discordjs/formatters` | Timestamp and mention formatting helpers |
| `@discordjs/rpc` | Desktop Rich Presence over local IPC sockets |
| `@discordjs/structures` | Data models decoupled from global clients |
| `@discordjs/util` | High-speed bitfields and shared validators |
| `next` | Tracking of the upcoming major version (v15 / canary) |

## 🛠️ CLI Reference

| Command | What it does |
| --- | --- |
| `pnpm cli audit` | Audits the full component catalog and protocol metrics. |
| `pnpm cli diff <path/to/package.json>` | Compares a project's dependencies against the baseline to detect drift. |
| `pnpm cli baseline` | Freezes or refreshes the baseline snapshot. |
| `pnpm cli rea` | Opens the reverse-engineering lab (see [boundaries](#-safety-boundaries)). |

Typical drift-check workflow:

```bash
# 1. See what the ecosystem looks like today
pnpm cli audit

# 2. Compare your bot against the baseline
pnpm cli diff ../my-bot/package.json

# 3. Happy with the new state? Refresh the baseline
pnpm cli baseline
```

---

## 📚 Knowledge Base

Deep dives the agent (and you) can consult instead of hunting through outdated tutorials. The guides are written in Spanish.

| Guide | What you get |
| --- | --- |
| [Complete ecosystem encyclopedia](.agents/skills/discord-skill/references/ecosystem-packages-complete.md) | In-depth look at each of the 15 packages. |
| [Low-level bot architecture](.agents/skills/discord-skill/references/low-level-bot-architecture.md) | A ~30 MB RAM bot with `core` + `ws` + `rest`, no heavy classes, no forced cache. |
| [Presenter pattern and clean architecture](.agents/skills/discord-skill/references/clean-architecture-presenters.md) | Decouple domain logic from the Discord interface for offline tests and clean i18n. |
| [Voice handshake and streaming](.agents/skills/discord-skill/references/voice-handshake-and-streaming.md) | Sync `VOICE_STATE_UPDATE` + `VOICE_SERVER_UPDATE`, handle live server migrations, connect audio nodes. |
| [Interaction lifecycle resilience](.agents/skills/discord-skill/references/interaction-lifecycle-resilience.md) | The 3-second window, smart auto-defer, avoiding `10062 Unknown Interaction`. |
| [Embedded Activities architecture](.agents/skills/discord-skill/references/embedded-activities-architecture.md) | OAuth2 token exchange, CSP URL mappings and Rich Presence sync. |
| [REA investigations](.agents/skills/discord-skill/references/rea-discord-investigations.md) | Reverse-engineering workflows for Discord research. |

### Raw-access snippets

Process Gateway events without instantiating models:

```js
client.ws.on('RAW', (packet) => {
  if (packet.t === 'MESSAGE_CREATE') {
    // packet.d is plain JSON: near-zero memory overhead
  }
});
```

Call experimental endpoints and flags before libraries support them:

```js
import { Routes } from 'discord-api-types/v10';

await client.rest.post(Routes.channelMessages(channelId), {
  body: { content: 'Experimental message', flags: 1 << 15 },
});
```


## 🛡️ Safety Boundaries

The skill enforces a few invariants so agents do not get your bot flagged:

1. **Token limits**: never call user-only endpoints (`/users/@me/billing`, friend requests, group DMs) with a `Bot <token>`. Discord answers `403 Forbidden` and can flag the application.
2. **Backpressure**: drain incoming Opus buffers immediately in voice streams to avoid memory leaks in large calls.
3. **Sweeper strategy**: when using `discord.js`, set strict cache limits (`makeCache`) to keep RAM under control.

Reverse-engineering work is bound by four fixed rules (no selfbots or ToS violations, evidence integrity, zero secret extraction, safe routing). Read them in [`discord-rea-boundary.md`](.agents/rules/discord-rea-boundary.md).


## 🧑‍💻 Development

```bash
pnpm install
pnpm build   # compile TypeScript
pnpm lint    # run oxlint
```

## 🤝 Contributing

Contributions are very welcome. Some ideas:

- Found an undocumented or experimental endpoint? Open an issue or a PR.
- Want to build a deeper AST extractor for `@discordjs/voice` or `@discordjs/brokers`?

Read [CONTRIBUTING.md](CONTRIBUTING.md) before sending a Pull Request. If `discord-skill` saves you time (or RAM), a ⭐ helps a lot.


## ⚠️ Disclaimer

`discord-skill` is an independent community project. It is not affiliated with, endorsed by, or sponsored by Discord Inc. or the discord.js project.


## 📜 License

Released under the [MIT License](LICENSE). © 2026 Shnimlz and contributors.
