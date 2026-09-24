const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getUser } = require('../../database');
const { xpForLevel } = require('../../utils/xp');
const config = require('../../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rank')
    .setDescription('Megmutatja a saját szintedet és az XP-det')
    .addUserOption(o => o.setName('felhasznalo').setDescription('Kinek nézd meg (alapból a sajátod)').setRequired(false)),
  async execute(interaction) {
    const target = interaction.options.getUser('felhasznalo') || interaction.user;
    const row = getUser(interaction.guild.id, target.id);
    const needed = xpForLevel(row.level);

    const embed = new EmbedBuilder()
      .setColor(config.colors.primary)
      .setTitle(`${target.username} rangja`)
      .addFields(
        { name: 'Szint', value: `${row.level}`, inline: true },
        { name: 'XP', value: `${row.xp} / követk. szinthez kell még kb. ${needed}`, inline: true }
      )
      .setThumbnail(target.displayAvatarURL());
    await interaction.reply({ embeds: [embed] });
  }
};
