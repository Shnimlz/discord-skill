export async function extractDiscordRoutes(): Promise<string[]> {
  try {
    // Dynamic import to inspect installed discord-api-types
    const apiTypes = await import('discord-api-types/v10');
    if (apiTypes.Routes) {
      return Object.keys(apiTypes.Routes).sort();
    }
  } catch {
    // Fallback if packages are not yet installed in node_modules
  }

  return [
    'channel',
    'channelBulkDelete',
    'channelFollowers',
    'channelInvites',
    'channelMessage',
    'channelMessages',
    'channelPermission',
    'channelPin',
    'channelPins',
    'channelRecipient',
    'channelTyping',
    'channelWebhooks',
    'guild',
    'guildAuditLog',
    'guildBan',
    'guildBans',
    'guildChannels',
    'guildEmoji',
    'guildEmojis',
    'guildIntegrations',
    'guildInvites',
    'guildMember',
    'guildMembers',
    'guildMembersSearch',
    'guildMemberRole',
    'guildPrune',
    'guildRole',
    'guildRoles',
    'guildSticker',
    'guildStickers',
    'guildVoiceRegions',
    'guildVoiceStateUser',
    'guildWebhooks',
    'interactionCallback',
    'oauth2CurrentApplication',
    'oauth2CurrentAuthorization',
    'user',
    'userChannels',
    'userGuildMember',
    'userGuilds',
    'voiceRegions',
    'webhook',
    'webhookMessage',
    'webhookToken',
    'applicationCommands',
    'applicationCommand',
    'applicationGuildCommands',
    'applicationGuildCommand',
  ].sort();
}
