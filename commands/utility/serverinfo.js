const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Szerver információk lekérése'),
  async execute(interaction) {
    const guild = interaction.guild;
    const embed = new EmbedBuilder()
      .setColor(config.colors.primary)
      .setTitle(guild.name)
      .setThumbnail(guild.iconURL())
      .addFields(
        { name: 'Tulajdonos', value: `<@${guild.ownerId}>`, inline: true },
        { name: 'Tagok', value: `${guild.memberCount}`, inline: true },
        { name: 'Létrehozva', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:D>`, inline: true },
        { name: 'Csatornák', value: `${guild.channels.cache.size}`, inline: true },
        { name: 'Szerepkörök', value: `${guild.roles.cache.size}`, inline: true },
        { name: 'Boost szint', value: `${guild.premiumTier}`, inline: true }
      );
    await interaction.reply({ embeds: [embed] });
  }
};
