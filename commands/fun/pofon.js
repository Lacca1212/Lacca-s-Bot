const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const config = require('../../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pofon')
    .setDescription('Pofonozz meg valakit!')
    .addUserOption(o => o.setName('felhasznalo').setDescription('Kit pofozz meg').setRequired(true)),
  async execute(interaction) {
    const target = interaction.options.getUser('felhasznalo');
    if (target.id === interaction.user.id) return interaction.reply({ content: 'Miért pofoznád meg magad? 😅', flags: MessageFlags.Ephemeral });

    const embed = new EmbedBuilder()
      .setColor(config.colors.danger)
      .setDescription(`👋 **${interaction.user.username}** jól pofonvágta **${target.username}**-t!`);
    await interaction.reply({ embeds: [embed] });
  }
};
