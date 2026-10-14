---
name: discord-skill
description: Comprehensive skill for the entire Discord.js ecosystem (discord.js, discord-api-types, @discordjs/core, @discordjs/rest, @discordjs/ws, @discordjs/voice, @discordjs/builders, @discordjs/brokers, @discordjs/proxy). Covers architectural blueprints, zero-cache low-level botting, Presenter pattern, voice UDP handshakes, interaction resilience, and API contract drift auditing.
---

# Discord Skill

A foundational guide, playbook, and operational protocol for engineering high-performance, distributed, and low-level Discord applications across the full **discord.js** ecosystem.

## 1. Guías de Ingeniería de Batalla (Deep Dives)

Para construir un bot sin el enredo de buscar en tutoriales genéricos o foros desactualizados, consulta directamente los manuales especializados:

* 📦 [**Enciclopedia Completa del Ecosistema Discord.js (15 Paquetes)**](references/ecosystem-packages-complete.md): Análisis exhaustivo (versión corta y profunda) de cada dependencia del monorepo (`core`, `ws`, `rest`, `voice`, `rpc`, `proxy`, etc.).
* 🚀 [**Creando un Bot de Bajo Nivel (Zero-Overhead)**](references/low-level-bot-architecture.md): Cómo montar un bot de 30 MB de RAM usando `@discordjs/core` + `@discordjs/ws` + `@discordjs/rest` sin clases pesadas ni caché forzado.
* 🏛️ [**Patrón Presenter & Arquitectura Limpia**](references/clean-architecture-presenters.md): Cómo desacoplar la lógica de dominio de la interfaz de Discord (inspirado en el modelo DDC), permitiendo tests 100% offline y soporte i18n limpio.
* 🎙️ [**La Anatomía del Handshake de Voz**](references/voice-handshake-and-streaming.md): Cómo sincronizar `VOICE_STATE_UPDATE` + `VOICE_SERVER_UPDATE`, manejar migraciones de servidor en vivo y conectar nodos de audio (Lavalink / `@discordjs/voice`).
* ⚡ [**Resiliencia en el Ciclo de Vida de Interacciones**](references/interaction-lifecycle-resilience.md): La ventana de 3 segundos, auto-defer inteligente, y cómo prevenir errores `10062 Unknown Interaction` o `InteractionAlreadyReplied`.
* 🎮 [**Arquitectura de Discord Activities (Embedded Apps)**](references/embedded-activities-architecture.md): Intercambio de tokens OAuth2, superación del CSP mediante URL Mappings y sincronización Rich Presence.

---

## 2. Matriz de Selección del Ecosistema

Nunca uses el monolito `discord.js` por defecto para cualquier tarea. Selecciona el componente exacto según el requerimiento:

| Requisito / Restricción | Paquete Recomendado | Ventaja Arquitectónica |
| :--- | :--- | :--- |
| **Alta concurrencia / Memoria Crítica** | `@discordjs/core` + `@discordjs/ws` | Cero OOP overhead. Omite instancias `Guild`, `Message` o `User`. Trabaja con JSONs planos. |
| **Microservicios / Sharding Distribuido** | `@discordjs/brokers` | Desacopla la recepción del Gateway de la lógica de negocio mediante colas (RabbitMQ, Kafka, Redis). |
| **Rate Limiting Global Compartido** | `@discordjs/proxy` | Microservicio HTTP independiente que centraliza las colas de buckets entre múltiples procesos o contenedores. |
| **Serverless / Endpoints HTTP Puros** | `@discordjs/rest` | Peticiones HTTP directas con verificación de firma Ed25519 (Cloudflare Workers / AWS Lambda). |
| **Voz en Tiempo Real (Tx / Rx)** | `@discordjs/voice` | Protocolo WebRTC/UDP, cifrado ChaCha20/XSalsa20, Opus decoding y Voice Receive streams para IA/VAD. |
| **UI Components y Slash Commands** | `@discordjs/builders` | Constructores tipados para Slash commands, Subcomandos, Action Rows, Modals y Select Menus. |
| **Especificaciones Canónicas y Flags** | `discord-api-types` | Flags de bits, nombres de eventos Gateway y tipos de payloads REST de la API v9/v10. |
| **Monolito Rápido / Prototipado** | `discord.js` | Caché en memoria, managers automáticos y colecciones tradicionales. |

---

## 3. Capacidades de Bajo Nivel & Rutas Crudas

### A. Intercepción Cruda de Paquetes en Gateway
Para procesar eventos a velocidad máxima sin instanciar modelos:
```typescript
client.ws.on('RAW', (packet) => {
  if (packet.t === 'MESSAGE_CREATE') {
    // Procesa packet.d directamente (JSON plano, memoria casi nula)
  }
});
```

### B. Ejecución REST Sin Restricciones
Para usar endpoints experimentales o banderas de Discord no contempladas aún en librerías:
```typescript
import { Routes } from 'discord-api-types/v10';

await client.rest.post(Routes.channelMessages(channelId), {
  body: {
    content: "Mensaje experimental",
    flags: 1 << 15, // Bit flags experimentales
  }
});
```

---

## 4. Auditoría de Drift de Contratos de la API

Para detectar cambios de versión o nuevos endpoints en tus dependencias:

```bash
# 1. Auditar componentes y métricas
pnpm cli audit

# 2. Comparar dependencias del proyecto contra el baseline
pnpm cli diff ./package.json

# 3. Actualizar la línea base
pnpm cli baseline
```

---

## 5. Invariantes de Seguridad

1. **Límites de Token**: Jamás llames a endpoints exclusivos de usuario (`/users/@me/billing`, solicitudes de amistad, DMs grupales) con un `Bot <token>`. Discord devuelve `403 Forbidden` y marca la aplicación.
2. **Backpressure**: En streams de voz entrantes, drena los buffers de Opus inmediatamente para evitar fugas de memoria en llamadas masivas.
3. **Estrategia de Sweepers**: Al usar `discord.js`, configura límites estrictos de caché (`makeCache`) para evitar consumo desmedido de RAM.
