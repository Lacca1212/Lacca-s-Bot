const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getUser } = require('../../database');
const config = require('../../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Egyenleged megtekintése')
    .addUserOption(o => o.setName('felhasznalo').setDescription('Kinek nézd meg (alapból a sajátod)').setRequired(false)),
  async execute(interaction) {
    const target = interaction.options.getUser('felhasznalo') || interaction.user;
    const row = getUser(interaction.guild.id, target.id);

    const embed = new EmbedBuilder()
      .setColor(config.colors.success)
      .setDescription(`💰 **${target.username}** egyenlege: **${row.balance}** coin`);
    await interaction.reply({ embeds: [embed] });
  }
};
