const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { db } = require('../../database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticketclaim')
    .setDescription('Ticket lefoglalása magadnak'),
  async execute(interaction) {
    const ticket = db.prepare('SELECT * FROM tickets WHERE channelId = ?').get(interaction.channel.id);
    if (!ticket) return interaction.reply({ content: 'Ez a csatorna nem egy ticket.', flags: MessageFlags.Ephemeral });

    db.prepare('UPDATE tickets SET claimedBy = ? WHERE channelId = ?').run(interaction.user.id, interaction.channel.id);
    await interaction.reply(`✅ ${interaction.user} lefoglalta ezt a ticketet.`);
  }
};
