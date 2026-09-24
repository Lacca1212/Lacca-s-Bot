const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { db } = require('../../database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticketclose')
    .setDescription('Bezárja az aktuális ticketet'),
  async execute(interaction) {
    const ticket = db.prepare('SELECT * FROM tickets WHERE channelId = ?').get(interaction.channel.id);
    if (!ticket) return interaction.reply({ content: 'Ez a csatorna nem egy ticket.', flags: MessageFlags.Ephemeral });

    await interaction.reply('🔒 A ticket 5 másodperc múlva bezárul...');
    db.prepare('DELETE FROM tickets WHERE channelId = ?').run(interaction.channel.id);
    setTimeout(() => interaction.channel.delete().catch(() => {}), 5000);
  }
};
