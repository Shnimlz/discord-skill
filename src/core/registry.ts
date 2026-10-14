import type { DiscordPackageMetadata } from './types.js';

export const DISCORD_ECOSYSTEM_PACKAGES = {
  'discord.js': {
    name: 'discord.js',
    version: '14.26.5',
    role: 'facade',
    description: 'High-level OOP facade with in-memory caching managers, client events and structures.',
  },
  'discord-api-types': {
    name: 'discord-api-types',
    version: '0.37.119',
    role: 'types',
    description: 'Canonical Discord REST and Gateway specifications, enums, bits, and JSON schemas (v9/v10).',
  },
  '@discordjs/core': {
    name: '@discordjs/core',
    version: '2.6.0',
    role: 'network',
    description: 'Zero-overhead bot framework without OOP cache. Clean raw REST and Gateway layer.',
  },
  '@discordjs/rest': {
    name: '@discordjs/rest',
    version: '2.6.3',
    role: 'network',
    description: 'HTTP request engine with per-bucket rate limiting, exponential backoff, and CDN helpers.',
  },
  '@discordjs/ws': {
    name: '@discordjs/ws',
    version: '2.0.4',
    role: 'gateway',
    description: 'Standalone WebSocket client with automatic sharding, resume handling, and zlib transport.',
  },
  '@discordjs/builders': {
    name: '@discordjs/builders',
    version: '1.11.0',
    role: 'ui',
    description: 'Type-safe builders for Slash commands, Embeds, Buttons, Select Menus, and Modals.',
  },
  '@discordjs/voice': {
    name: '@discordjs/voice',
    version: '0.18.0',
    role: 'audio',
    description: 'Real-time WebRTC/UDP audio streaming stack with Opus encoding, decoding, and encryption.',
  },
  '@discordjs/brokers': {
    name: '@discordjs/brokers',
    version: '0.2.1',
    role: 'broker',
    description: 'Inter-process messaging, distributed sharding, and queue-based event brokers.',
  },
  '@discordjs/proxy': {
    name: '@discordjs/proxy',
    version: '1.1.0',
    role: 'infra',
    description: 'Standalone HTTP proxy microservice for centralized multi-process rate limiting.',
  },
  '@discordjs/collection': {
    name: '@discordjs/collection',
    version: '2.1.1',
    role: 'utility',
    description: 'High-performance Map extension with array utility methods and LRU sweeper algorithms.',
  },
  '@discordjs/formatters': {
    name: '@discordjs/formatters',
    version: '0.6.0',
    role: 'utility',
    description: 'String and markdown formatters for Discord timestamps, mentions, blockquotes, and links.',
  },
  '@discordjs/rpc': {
    name: '@discordjs/rpc',
    version: '4.0.1',
    role: 'infra',
    description: 'Rich Presence client for desktop apps communicating via local IPC named pipes.',
  },
  '@discordjs/structures': {
    name: '@discordjs/structures',
    version: '1.0.0-dev',
    role: 'facade',
    description: 'Decoupled pure data structures independent of global client caching managers.',
  },
  '@discordjs/util': {
    name: '@discordjs/util',
    version: '1.1.0',
    role: 'utility',
    description: 'Internal bitfield manipulators (BitField), Snowflake validators, and color converters.',
  },
  'next': {
    name: 'next',
    version: '15.0.0-dev',
    role: 'facade',
    description: 'Bleeding-edge canary evolution branch targeting next-generation architectural changes.',
  },
} satisfies Record<string, DiscordPackageMetadata>;
