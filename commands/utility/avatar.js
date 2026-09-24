const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Profilkép megjelenítése')
    .addUserOption(o => o.setName('felhasznalo').setDescription('Kinek nézd meg (alapból a sajátod)').setRequired(false)),
  async execute(interaction) {
    const user = interaction.options.getUser('felhasznalo') || interaction.user;
    const embed = new EmbedBuilder()
      .setColor(config.colors.primary)
      .setTitle(`${user.username} profilképe`)
      .setImage(user.displayAvatarURL({ size: 512 }));
    await interaction.reply({ embeds: [embed] });
  }
};
