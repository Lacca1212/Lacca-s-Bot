const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { db } = require('../../database');
const config = require('../../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Coin ranglista megtekintése'),
  async execute(interaction) {
    const rows = db.prepare('SELECT * FROM users WHERE guildId = ? ORDER BY balance DESC LIMIT 10').all(interaction.guild.id);
    if (rows.length === 0) return interaction.reply({ content: 'Még nincs adat a ranglistán.' });

    const lines = await Promise.all(rows.map(async (r, i) => {
      const user = await interaction.client.users.fetch(r.userId).catch(() => null);
      return `**${i + 1}.** ${user ? user.tag : r.userId} – ${r.balance} coin`;
    }));

    const embed = new EmbedBuilder()
      .setColor(config.colors.success)
      .setTitle('💰 Coin ranglista')
      .setDescription(lines.join('\n'));
    await interaction.reply({ embeds: [embed] });
  }
};
