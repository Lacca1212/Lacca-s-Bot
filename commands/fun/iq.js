const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('iq')
    .setDescription('Teszteld mennyire vagy okos!')
    .addUserOption(o => o.setName('felhasznalo').setDescription('Kinek az IQ-ját nézd meg (alapból a sajátod)').setRequired(false)),
  async execute(interaction) {
    const target = interaction.options.getUser('felhasznalo') || interaction.user;
    const seed = [...target.id].reduce((a, c) => a + c.charCodeAt(0), 0);
    const iq = 60 + (seed % 90);

    const embed = new EmbedBuilder()
      .setColor(config.colors.primary)
      .setDescription(`🧠 **${target.username}** IQ-ja: **${iq}**`);
    await interaction.reply({ embeds: [embed] });
  }
};
