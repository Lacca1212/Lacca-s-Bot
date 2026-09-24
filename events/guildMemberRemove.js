const { getGuildSettings } = require('../database');
const { EmbedBuilder } = require('discord.js');
const config = require('../config');

module.exports = {
  name: 'guildMemberRemove',
  async execute(member) {
    const settings = getGuildSettings(member.guild.id);

    if (settings.byeChannelId) {
      const channel = member.guild.channels.cache.get(settings.byeChannelId);
      if (channel) {
        const text = (settings.byeMessage || '{user} elhagyta a szervert.')
          .replaceAll('{user}', member.user.tag)
          .replaceAll('{server}', member.guild.name)
          .replaceAll('{membercount}', member.guild.memberCount.toString());
        const embed = new EmbedBuilder()
          .setColor(config.colors.danger)
          .setDescription(text)
          .setThumbnail(member.user.displayAvatarURL());
        channel.send({ embeds: [embed] }).catch(() => {});
      }
    }

    if (settings.counterChannelId) {
      const counterChannel = member.guild.channels.cache.get(settings.counterChannelId);
      if (counterChannel) {
        const format = settings.counterFormat || 'Tagok: {count}';
        counterChannel.setName(format.replaceAll('{count}', member.guild.memberCount.toString())).catch(() => {});
      }
    }
  }
};
