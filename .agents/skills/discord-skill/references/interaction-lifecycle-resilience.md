# Resiliencia en el Ciclo de Vida de Interacciones

El 80% de los crashes en bots de Discord son variaciones de:
* `Error [InteractionAlreadyReplied]: The reply to this interaction has already been sent or deferred.`
* `DiscordAPIError[10062]: Unknown interaction`

Estos errores ocurren por violar las reglas de tiempo y estado del protocolo de interacciones de Discord.

---

## 1. Las Reglas Invariables del Protocolo

1. **La Ventana de 3 Segundos**: Discord exige un acuse de recibo inicial (ACK) en menos de 3,000 milisegundos. Si tu bot no responde o no difiere (`deferReply`) en ese lapso, Discord invalida el token y el usuario ve *"La aplicación no respondió"*.
2. **Vida del Token (15 minutos)**: Una vez diferida (`deferReply`), tienes hasta 15 minutos para editar la respuesta (`editReply`) o enviar mensajes de seguimiento (`followUp`).
3. **ACK Único**: Solo puedes llamar a `reply()`, `deferReply()`, `update()` o `deferUpdate()` **exactamente una vez** por interacción.

---

## 2. El Patrón "Auto-Defer Safe Handler"

En lugar de poner `await interaction.deferReply()` a ciegas en cada comando, utiliza un wrapper de ejecución resiliente:

```typescript
import type { ChatInputCommandInteraction } from 'discord.js';

export async function executeSafeInteraction(
  interaction: ChatInputCommandInteraction,
  handler: (interaction: ChatInputCommandInteraction) => Promise<void>
) {
  // Timer para auto-diferir si el handler toma más de 1.8 segundos
  let isDeferred = false;
  const deferTimer = setTimeout(async () => {
    if (!interaction.replied && !interaction.deferred) {
      try {
        await interaction.deferReply({ ephemeral: true });
        isDeferred = true;
      } catch {
        // La interacción pudo expirar por lag de red
      }
    }
  }, 1800);

  try {
    await handler(interaction);
  } catch (error) {
    console.error(`Error en comando /${interaction.commandName}:`, error);

    const errorMessage = {
      content: '❌ Ocurrió un error inesperado al procesar tu comando.',
      ephemeral: true,
    };

    if (interaction.deferred || interaction.replied) {
      await interaction.editReply(errorMessage).catch(() => null);
    } else {
      await interaction.reply(errorMessage).catch(() => null);
    }
  } finally {
    clearTimeout(deferTimer);
  }
}
```

---

## 3. Resiliencia en Component Collectors (Botones y Select Menus)

Cuando creas botones de confirmación o paginación, el error común es olvidar el timeout o no capturar clicks de usuarios no autorizados:

```typescript
const reply = await interaction.reply({
  content: '¿Estás seguro de continuar?',
  components: [actionRow],
  fetchReply: true,
});

const collector = reply.createMessageComponentCollector({
  time: 30000, // 30 segundos
});

collector.on('collect', async (i) => {
  // 1. Validar que quien hizo click es quien ejecutó el comando original
  if (i.user.id !== interaction.user.id) {
    return i.reply({
      content: '❌ No puedes interactuar con los controles de otro usuario.',
      ephemeral: true,
    });
  }

  // 2. Desactivar el botón inmediatamente para evitar doble click (race condition)
  await i.update({
    content: 'Procesando acción...',
    components: [], // Remover botones
  });

  collector.stop('COMPLETED');
});

collector.on('end', async (_, reason) => {
  // 3. Limpiar componentes si venció el tiempo sin interacción
  if (reason !== 'COMPLETED') {
    await interaction.editReply({
      content: '⌛ La interacción ha expirado por inactividad.',
      components: [],
    }).catch(() => null);
  }
});
```
