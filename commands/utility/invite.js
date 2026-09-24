const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const config = require('../../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('invite')
    .setDescription('A bot meghívása'),
  async execute(interaction) {
    const link = `https://discord.com/oauth2/authorize?client_id=${config.clientId}&permissions=${PermissionsBitField.Flags.Administrator}&scope=bot%20applications.commands`;
    const embed = new EmbedBuilder()
      .setColor(config.colors.primary)
      .setDescription(`[Kattints ide a meghíváshoz](${link})`);
    await interaction.reply({ embeds: [embed] });
  }
};
