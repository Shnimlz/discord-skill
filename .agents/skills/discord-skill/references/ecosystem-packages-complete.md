# Enciclopedia Completa del Ecosistema Discord.js (15 Paquetes)

Este documento detalla cada uno de los 15 paquetes y componentes que componen el monorepo oficial de **discord.js** y la plataforma de Discord. Cada dependencia se describe en formato **Corto** (definición rápida y cuándo usarlo) y **Largo / Profundo** (arquitectura interna, gotchas, problemas resueltos y código clave).

---

## Índice de Componentes

1. [`discord.js`](#1-discordjs)
2. [`discord-api-types`](#2-discord-api-types)
3. [`@discordjs/brokers`](#3-discordjsbrokers)
4. [`@discordjs/builders`](#4-discordjsbuilders)
5. [`@discordjs/collection`](#5-discordjscollection)
6. [`@discordjs/core`](#6-discordjscore)
7. [`@discordjs/formatters`](#7-discordjsformatters)
8. [`next` (v15 / Canary)](#8-next-canary--v15)
9. [`@discordjs/proxy`](#9-discordjsproxy)
10. [`@discordjs/rest`](#10-discordjsrest)
11. [`@discordjs/rpc`](#11-discordjsrpc)
12. [`@discordjs/structures`](#12-discordjsstructures)
13. [`@discordjs/util`](#13-discordjsutil)
14. [`@discordjs/voice`](#14-discordjsvoice)
15. [`@discordjs/ws`](#15-discordjsws)

---

### 1. `discord.js`

* **Versión Corta**:  
  La fachada monolítica y tradicional. Agrupa managers de caché, clientes unificados y modelos OOP (`Guild`, `Message`, `User`). Ideal para prototipado rápido y bots pequeños/medianos.
* **Explicación Profunda & Arquitectura**:  
  * **Cómo funciona**: Envuelve `@discordjs/rest` y `@discordjs/ws` bajo la clase `Client`. Cuando el Gateway recibe un evento, `discord.js` busca en sus `Managers` (ej. `GuildMemberManager`, `MessageManager`) y crea instancias de clases de alto nivel con métodos acoplados como `message.reply()` o `guild.members.fetch()`.
  * **El Problema**: Acumula memoria RAM sin control a gran escala. Para evitarlo, requiere configurar `makeCache: Options.cacheWithLimits(...)` y sweepers de memoria activos.
  * **Casos de uso**: Bots estándar, prototipos, bots con menos de 10,000 servidores donde la simplicidad supera a la optimización de hardware.

---

### 2. `discord-api-types`

* **Versión Corta**:  
  La especificación canónica y tipada de la API de Discord en TypeScript. Contiene enums, bits de permisos, rutas REST y payloads del Gateway (v9/v10) con cero dependencias de ejecución.
* **Explicación Profunda & Arquitectura**:  
  * **Cómo funciona**: Mapea uno a uno los contratos oficiales de Discord documentados en `discord.com/developers/docs`. No contiene lógica ejecutable pesada; son tipos, interfaces y objetos constantes (`Routes`, `GatewayDispatchEvents`, `PermissionFlagsBits`).
  * **El Problema que Resuelve**: Evita números mágicos o cadenas hardcodeadas. Permite tipar llamadas crudas con seguridad de compilación.
  * **Ejemplo clave**:
    ```typescript
    import { Routes, GatewayDispatchEvents, PermissionFlagsBits } from 'discord-api-types/v10';
    const route = Routes.channelMessages('123456789');
    const requiredPerms = PermissionFlagsBits.Administrator | PermissionFlagsBits.ManageGuild;
    ```

---

### 3. `@discordjs/brokers`

* **Versión Corta**:  
  Abstracción de mensajería inter-procesos y colas distribuidas para orquestar bots de gran escala desacoplando el Gateway de los workers.
* **Explicación Profunda & Arquitectura**:  
  * **Cómo funciona**: Proporciona interfaces pub/sub y adaptadores de mensajería (Redis, RabbitMQ o IPC) para que los procesos de Gateway (que reciben eventos de Discord) depositen tareas en colas y los workers de cómputo las procesen en paralelo.
  * **El Problema que Resuelve**: En bots monolíticos, si la CPU se satura ejecutando un comando pesado, el hilo de Node.js se bloquea, el WebSocket deja de responder a los Heartbeats de Discord y los shards se desconectan.
  * **Arquitectura**: `Discord Gateway -> Shard Process -> Broker (Queue) -> Compute Workers`.

---

### 4. `@discordjs/builders`

* **Versión Corta**:  
  Constructores tipados con interfaz fluida para crear Slash Commands, Embeds, Modales y Componentes de Mensajes (Botones y Select Menus) asegurando que el JSON cumpla las restricciones de Discord.
* **Explicación Profunda & Arquitectura**:  
  * **Cómo funciona**: Implementa el patrón Builder. En lugar de escribir JSONs anidados a mano propensos a errores (como límites de caracteres o tipos incorrectos), valida los límites en tiempo de compilación y ejecución.
  * **Componentes clave**:
    * `SlashCommandBuilder`: Comandos, subcomandos, opciones tipadas (string, integer, user, etc.).
    * `ActionRowBuilder`, `ButtonBuilder`, `StringSelectMenuBuilder`: Interfaz de usuario.
    * `EmbedBuilder`: Colores, autores, campos, thumbnails.
    * `ModalBuilder`, `TextInputBuilder`: Formularios emergentes.
  * **Ejemplo clave**:
    ```typescript
    import { SlashCommandBuilder } from '@discordjs/builders';
    export const pingCommand = new SlashCommandBuilder()
      .setName('ping')
      .setDescription('Responde con pong y latencia');
    ```

---

### 5. `@discordjs/collection`

* **Versión Corta**:  
  Estructura de datos central de Discord.js. Es una extensión de la clase nativa `Map<K, V>` de JavaScript con utilidades funcionales estilo Array (`filter`, `map`, `find`, `sweep`, `first`).
* **Explicación Profunda & Arquitectura**:  
  * **Cómo funciona**: Combina la velocidad de acceso $O(1)$ por clave de una tabla hash con las funciones de conveniencia de un Array.
  * **Capacidades Internas**:
    * `sweep(fn)`: Algoritmo de recolección de basura interno; elimina elementos que cumplen una condición para liberar RAM periódicamente.
    * `random()`: Selección aleatoria ponderada o directa sin convertir a array.
    * `partition()`: Divide la colección en dos basadas en un predicado en un solo pase.

---

### 6. `@discordjs/core`

* **Versión Corta**:  
  El núcleo de ejecución de bajo nivel para bots de alto rendimiento. Conecta `@discordjs/rest` con `@discordjs/ws` sin usar modelos de clases pesadas ni caché forzado.
* **Explicación Profunda & Arquitectura**:  
  * **Cómo funciona**: Proporciona el objeto `api` con métodos tipados para todas las operaciones de Discord (ej. `api.channels.createMessage(...)`) que devuelven JSONs puros (`APIMessage`) en lugar de instancias de clases.
  * **Impacto en Memoria**: Reduce el consumo de RAM hasta en un 80% frente al cliente tradicional de `discord.js`.
  * **Para quién es**: Bots que están en decenas de miles de servidores, bots de música, dashboards y microservicios.

---

### 7. `@discordjs/formatters`

* **Versión Corta**:  
  Funciones utilitarias para generar sintaxis Markdown nativa de Discord (timestamps interactivos, menciones, enlaces, bloques de código y comillas).
* **Explicación Profunda & Arquitectura**:  
  * **Cómo funciona**: Evita formatear strings a mano (`<@!123>`, `<t:1620000:R>`). Genera la sintaxis exacta reconocida por el motor de renderizado del cliente de Discord.
  * **Ejemplos clave**:
    ```typescript
    import { time, userMention, TimestampStyles } from '@discordjs/formatters';
    const mention = userMention('123456789'); // <@123456789>
    const relativeTime = time(new Date(), TimestampStyles.RelativeTime); // <t:1728945600:R> (e.g. "hace 5 minutos")
    ```

---

### 8. `next` (Canary / v15)

* **Versión Corta**:  
  La rama evolutiva y bleeding-edge de Discord.js. Muestra los cambios de diseño arquitectónico, tipado estricto y migraciones antes de su lanzamiento a producción.
* **Explicación Profunda & Arquitectura**:  
  * **Objetivos de `next`**: Desacoplar aún más el cliente monolítico, adoptar TypeScript estricto de última generación, optimizar el empaquetado ESM puro, eliminar APIs deprecadas de versiones anteriores de Discord y soportar nuevas primitivas del cliente.
  * **Monitoreo**: Auditar `next` permite anticipar breaking changes meses antes de que se vuelvan obligatorios.

---

### 9. `@discordjs/proxy`

* **Versión Corta**:  
  Servidor proxy HTTP independiente diseñado para ejecutarse como un microservicio que centraliza el manejo de rate limits entre múltiples procesos o servidores independientes.
* **Explicación Profunda & Arquitectura**:  
  * **El Problema que Resuelve**: Si tienes 10 shards o 5 microservicios corriendo en distintos contenedores y todos hacen llamadas HTTP a Discord con el mismo token, cada uno gestiona sus buckets por separado, provocando bloqueos globales y errores HTTP 429 (`Too Many Requests`).
  * **Cómo funciona**: Todos los bots apuntan sus peticiones HTTP al proxy (`localhost:8080`). El proxy encola, sincroniza los buckets de Cloudflare y despacha las llamadas a Discord de forma coordinada.

---

### 10. `@discordjs/rest`

* **Versión Corta**:  
  El motor HTTP que ejecuta llamadas contra la REST API de Discord. Gestiona buckets de rate limits, reintentos con backoff exponencial, construcción de URLs del CDN y autenticación de webhooks Ed25519.
* **Explicación Profunda & Arquitectura**:  
  * **Manejo de Buckets**: Discord devuelve en los headers HTTP el hash del bucket y el tiempo de reset (`X-RateLimit-Reset-After`). `@discordjs/rest` pausa automáticamente solo las peticiones a ese recurso específico sin congelar el resto de la aplicación.
  * **Modo Serverless**: Permite procesar interacciones webhooks en Cloudflare Workers o AWS Lambda sin abrir WebSockets.

---

### 11. `@discordjs/rpc`

* **Versión Corta**:  
  Librería de Rich Presence para aplicaciones de escritorio y videojuegos. Se comunica directamente con el cliente local de Discord instalado en la PC mediante IPC / Named Pipes.
* **Explicación Profunda & Arquitectura**:  
  * **Cómo funciona**: No usa tokens de bot ni conexiones de red a `discord.com`. Se conecta localmente al socket IPC del cliente (`\\.\pipe\discord-ipc-0` en Windows o `/tmp/discord-ipc-0` en Linux/macOS) usando autenticación RPC y OAuth2.
  * **Casos de uso**: Mostrar qué canción escuchas en un reproductor de escritorio, el estado de un videojuego (puntuación, partida en curso, botón de "Unirse a la partida") o herramientas de streaming.

---

### 12. `@discordjs/structures`

* **Versión Corta**:  
  Iniciativa arquitectónica para desacoplar las estructuras de datos (`Message`, `Guild`, `Role`) de los Managers de caché del cliente.
* **Explicación Profunda & Arquitectura**:  
  * **El Problema**: En `discord.js` tradicional, no puedes crear un objeto `Message` sin tener un `Client` instanciado que controle la caché.
  * **La Solución**: Permite instanciar modelos puros a partir de datos serializados sin necesidad de mantener un cliente global abierto, facilitando arquitecturas sin estado (stateless) y tests unitarios.

---

### 13. `@discordjs/util`

* **Versión Corta**:  
  Conjunto de utilidades matemáticas, manipulación de bitfields y validaciones internas compartidas entre todos los paquetes del monorepo.
* **Explicación Profunda & Arquitectura**:  
  * **`BitField`**: Clase base para manipular máscaras de bits binarias de alta velocidad para permisos (`PermissionsBitField`), intents (`IntentsBitField`) y flags de usuarios/mensajes.
  * **Validadores**: Helpers para verificar números de Snowflake válidos, rangos de colores enteros y tipos primitivos de JavaScript.

---

### 14. `@discordjs/voice`

* **Versión Corta**:  
  La pila completa para canales de voz de Discord. Administra la conexión UDP/RTP, cifrado seguro (ChaCha20-Poly1305 / XSalsa20), pipelines de transcodificación Opus y recepción de audio por usuario.
* **Explicación Profunda & Arquitectura**:  
  * **Transmisión (Tx)**: Convierte buffers PCM a frames Opus de 20ms, los empaqueta en datagramas RTP cifrados y los envía vía UDP al Voice Server asignado por Discord.
  * **Recepción (Rx)**: Permite suscribirse al stream de voz de un usuario en particular (`receiver.subscribe(userId)`), descifrarlo en tiempo real y alimentar modelos de reconocimiento de voz (STT) como Whisper.

---

### 15. `@discordjs/ws`

* **Versión Corta**:  
  El motor de WebSockets Gateway independiente. Controla la conexión persistente con Discord, sharding automático, reanudación de sesiones (Resume) y descompresión de tráfico zlib.
* **Explicación Profunda & Arquitectura**:  
  * **Cómo funciona**: `WebSocketManager` consulta a Discord la cantidad recomendada de shards (`/gateway/bot`) y levanta instancias `WebSocketShard` independientes.
  * **Resiliencia**: Si la conexión cae, envía automáticamente OpCode 6 (`Resume`) con el `session_id` y el último número de secuencia (`seq`) para recuperar los eventos perdidos sin disparar un `GUILD_CREATE` masivo.
