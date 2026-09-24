const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const { db } = require('../../database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticketremove')
    .setDescription('Felhasználó eltávolítása a jelenlegi ticketből')
    .addUserOption(o => o.setName('felhasznalo').setDescription('Az eltávolítandó felhasználó').setRequired(true)),
  async execute(interaction) {
    const ticket = db.prepare('SELECT * FROM tickets WHERE channelId = ?').get(interaction.channel.id);
    if (!ticket) return interaction.reply({ content: 'Ez a csatorna nem egy ticket.', flags: MessageFlags.Ephemeral });

    const user = interaction.options.getUser('felhasznalo');
    await interaction.channel.permissionOverwrites.edit(user.id, { ViewChannel: false });
    await interaction.reply(`✅ ${user} eltávolítva a ticketből.`);
  }
};
