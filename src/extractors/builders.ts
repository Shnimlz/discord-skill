export async function extractBuilderComponents(): Promise<string[]> {
  try {
    const builders = await import('@discordjs/builders');
    return Object.keys(builders)
      .filter((k) => k.endsWith('Builder'))
      .sort();
  } catch {
    // Fallback if not installed
  }

  return [
    'ActionRowBuilder',
    'ButtonBuilder',
    'ChannelSelectMenuBuilder',
    'EmbedBuilder',
    'MentionableSelectMenuBuilder',
    'ModalBuilder',
    'RoleSelectMenuBuilder',
    'SlashCommandBuilder',
    'SlashCommandSubcommandBuilder',
    'SlashCommandSubcommandGroupBuilder',
    'StringSelectMenuBuilder',
    'TextInputBuilder',
    'UserSelectMenuBuilder',
  ].sort();
}
