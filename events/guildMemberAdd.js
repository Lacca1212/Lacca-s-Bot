const { getGuildSettings } = require('../database');
const { EmbedBuilder } = require('discord.js');
const config = require('../config');

module.exports = {
  name: 'guildMemberAdd',
  async execute(member) {
    const settings = getGuildSettings(member.guild.id);

    if (settings.welcomeChannelId) {
      const channel = member.guild.channels.cache.get(settings.welcomeChannelId);
      if (channel) {
        const text = (settings.welcomeMessage || 'Isten hozott {user} a(z) {server} szerveren!')
          .replaceAll('{user}', `<@${member.id}>`)
          .replaceAll('{server}', member.guild.name)
          .replaceAll('{membercount}', member.guild.memberCount.toString());
        const embed = new EmbedBuilder()
          .setColor(config.colors.success)
          .setDescription(text)
          .setThumbnail(member.user.displayAvatarURL());
        channel.send({ embeds: [embed] }).catch(() => {});
      }
    }

    if (settings.autoroleId) {
      const role = member.guild.roles.cache.get(settings.autoroleId);
      if (role) member.roles.add(role).catch(() => {});
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
