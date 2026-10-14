# Creando un Bot de Bajo Nivel (Zero-Overhead)

Construir un bot de Discord con la fachada monolítica tradicional (`new Client()` de `discord.js`) genera problemas graves de escalabilidad: cada servidor agrega objetos pesados en memoria (`Guild`, `GuildMember`, `Channel`, `Message`), acumulando cientos de megabytes de RAM innecesariamente.

El enfoque **Low-Level (Zero-Overhead)** utiliza las capas puras del ecosistema:
* **`@discordjs/rest`**: Peticiones HTTP independientes con rate limiting por bucket.
* **`@discordjs/ws`**: Conexión cruda al Gateway de WebSocket con control total de eventos y compresión zlib.
* **`@discordjs/core`**: API tipada sin managers de caché en memoria.

---

## 1. El Boilerplate de Bajo Nivel (< 50 líneas)

Este ejemplo levanta un bot de Discord de producción consumiendo **menos de 35 MB de RAM**, sin importar en cuántos servidores esté:

```typescript
import { REST } from '@discordjs/rest';
import { WebSocketManager, WebSocketShardEvents } from '@discordjs/ws';
import { GatewayDispatchEvents, GatewayIntentBits, Client } from '@discordjs/core';

const TOKEN = process.env.DISCORD_TOKEN!;

// 1. Configurar REST (Motor HTTP)
const rest = new REST({ version: '10' }).setToken(TOKEN);

// 2. Configurar Gateway WebSocket (Motor de eventos)
const gateway = new WebSocketManager({
  token: TOKEN,
  intents: GatewayIntentBits.Guilds | GatewayIntentBits.GuildVoiceStates,
  rest,
});

// 3. Cliente tipado sin caché (@discordjs/core)
const client = new Client({ rest, gateway });

// 4. Escuchar eventos directamente como objetos JSON crudos
client.on(GatewayDispatchEvents.Ready, ({ data }) => {
  console.log(`🤖 Conectado como ${data.user.username}#${data.user.discriminator} (ID: ${data.user.id})`);
});

client.on(GatewayDispatchEvents.InteractionCreate, async ({ data: interaction, api }) => {
  // Las interacciones llegan como payloads JSON planos (APIBaseInteraction)
  if (interaction.type === 2) { // 2 = APPLICATION_COMMAND
    await api.interactions.reply(interaction.id, interaction.token, {
      content: `¡Hola! Comando ejecutado con arquitectura de bajo nivel.`,
      flags: 64, // Ephemeral
    });
  }
});

// 5. Iniciar la conexión al Gateway
await gateway.connect();
```

---

## 2. Diferencias Críticas: Monolito vs. Bajo Nivel

| Aspecto | `discord.js` Monolítico | Arquitectura Bajo Nivel (`core` + `ws`) |
| :--- | :--- | :--- |
| **Consumo de Memoria** | Alto (150 MB - 2 GB según servidores). | Mínimo y plano (25 MB - 50 MB constante). |
| **Estructuras de Datos** | Instancias de clases (`Guild`, `User`, `Message`). | Objetos JSON nativos (`APIGuild`, `APIUser`). |
| **Caché de Objetos** | Automática e intrusiva (`Collection` en memoria). | Cero caché por defecto (o delegada a Redis). |
| **Tolerancia a Caídas** | Reiniciar el bot reinicia la conexión WebSocket. | El Gateway se puede aislar en un proceso independiente. |
| **Latencia de Eventos** | Pasa por parsers, sweepers y constructores. | Inmediata: del socket al handler en <1 ms. |

---

## 3. Cuándo usar este enfoque
1. **Bots de Música & Streaming**: El bot solo necesita coordinar voz y comandos; almacenar 100,000 miembros en memoria es un desperdicio masivo.
2. **Microservicios**: Separar el proceso que recibe WebSockets de los workers que procesan comandos (usando colas como RabbitMQ o Kafka).
3. **Escalabilidad Horizontal**: Correr 16 shards en contenedores Docker ultra-ligeros con límites estrictos de memoria.
