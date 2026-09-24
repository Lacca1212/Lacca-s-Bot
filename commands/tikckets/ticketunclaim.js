const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { db } = require('../../database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticketunclaim')
    .setDescription('Ticket visszaadása, hogy más is lefoglalhassa'),
  async execute(interaction) {
    const ticket = db.prepare('SELECT * FROM tickets WHERE channelId = ?').get(interaction.channel.id);
    if (!ticket) return interaction.reply({ content: 'Ez a csatorna nem egy ticket.', flags: MessageFlags.Ephemeral });

    db.prepare('UPDATE tickets SET claimedBy = NULL WHERE channelId = ?').run(interaction.channel.id);
    await interaction.reply('🔓 A ticket visszakerült a szabad ticketek közé.');
  }
};
