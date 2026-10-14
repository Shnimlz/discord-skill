---
name: discord-skill
description: Comprehensive skill for the entire Discord.js ecosystem (discord.js, discord-api-types, @discordjs/core, @discordjs/rest, @discordjs/ws, @discordjs/voice, @discordjs/builders, @discordjs/brokers, @discordjs/proxy). Covers architectural decisions, zero-cache botting, low-level Gateway/REST manipulation, voice UDP pipelines, and API contract drift auditing.
---

# Discord Skill

A foundational guide and operational protocol for engineering high-performance, distributed, and low-level Discord applications across the full **discord.js** ecosystem.

## 1. Ecosystem Matrix & Component Selection

Never default to `discord.js` monolith for every scenario. Select the appropriate tool from the modular ecosystem:

| Need / Constraint | Recommended Package | Architectural Advantage |
| :--- | :--- | :--- |
| **High Memory Constraints / 50k+ Guilds** | `@discordjs/core` + `@discordjs/ws` | Zero OOP overhead. Skips creating heavy `Guild`, `Message` and `User` instances. Uses plain JSON objects. |
| **Microservices / Distributed Shards** | `@discordjs/brokers` | Decouples Gateway dispatch from business logic over message queues (RabbitMQ, Kafka, Redis). |
| **Shared Global Rate Limiting** | `@discordjs/proxy` | A standalone HTTP proxy microservice that centralizes bucket queues across multiple bot instances. |
| **Raw REST / Serverless Interactions** | `@discordjs/rest` | Pure HTTP requests with Ed25519 signature validation (ideal for Cloudflare Workers / AWS Lambda). |
| **Real-Time Voice & Audio** | `@discordjs/voice` | WebRTC/UDP protocol handling, ChaCha20/XSalsa20 encryption, Opus decoding/encoding, and Voice Receive streams. |
| **Type-Safe Slash & UI Components** | `@discordjs/builders` | Declarative definitions for Slash commands, Subcommands, Action Rows, Modals, and Select Menus. |
| **Canonical API Specs & Flags** | `discord-api-types` | Bitfield flags, raw Gateway event names, and exact REST payload types for Discord API v9/v10. |
| **Standard Monolith / Rapid Prototyping** | `discord.js` | Built-in caching, collections, sweepers, and unified event emitters. |

---

## 2. Low-Level Capabilities & Deep Internals

### A. Raw Gateway & Packet Interception
When bypassing the standard caching pipeline, hook directly into the WebSocket dispatch:
```typescript
// Listening to raw Gateway packets without instantiating objects
client.ws.on('RAW', (packet) => {
  if (packet.t === 'MESSAGE_CREATE') {
    // Process packet.d directly (plain JSON, near zero memory)
  }
});
```

### B. Unrestricted REST Execution
Do not wait for library updates when Discord releases experimental or canary features. Execute raw API calls:
```typescript
import { Routes } from 'discord-api-types/v10';

// Raw route invocation with arbitrary payload
await client.rest.post(Routes.channelMessages(channelId), {
  body: {
    content: "Experimental message",
    flags: 1 << 15, // Custom/experimental bit flags
  }
});
```

### C. Voice Receive Pipeline (Audio Ingestion)
To capture real-time audio from users in a voice channel:
1. Connect via `@discordjs/voice` using `joinVoiceChannel`.
2. Subscribe to the `receiver`:
```typescript
const receiver = connection.receiver;
receiver.speaking.on('start', (userId) => {
  const opusStream = receiver.subscribe(userId, {
    mode: 'opus',
    end: { behavior: 'afterSilence', duration: 100 },
  });
  // Pipe opusStream to an Opus decoder (e.g. prism-media) -> PCM -> Whisper STT / VAD
});
```

---

## 3. Auditing API Contract Drift

To detect breaking changes, deprecated fields, or newly added routes between versions:

1. **Check for drift against the baseline**:
   ```bash
   pnpm cli diff ./package.json
   ```
2. **Review added/removed routes, gateway events, or builders**:
   * Inspect changes reported in `baselines/baseline.json`.
   * Update the baseline when upgrades are validated:
   ```bash
   pnpm cli baseline
   ```

---

## 4. Engineering Invariants

1. **Token Boundaries**: Never attempt to call User-only endpoints (`/users/@me/billing`, friend requests, group DMs) with a `Bot <token>`. Discord returns `403 Forbidden` and flags the application.
2. **Backpressure**: In voice streams, ensure Opus decoders drain buffers promptly to avoid memory leaks on high-concurrency voice channels.
3. **Sweeper Strategy**: When using `discord.js`, configure granular cache limits (`makeCache`) to prevent unbounded RAM expansion.
