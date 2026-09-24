const { PermissionFlagsBits, ChannelType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { db, getGuildSettings } = require('../database');
const config = require('../config');

module.exports = {
  ticket: async (interaction) => {
    if (interaction.customId !== 'ticket:open') return;

    const settings = getGuildSettings(interaction.guild.id);
    if (!settings.ticketCategoryId) {
      return interaction.reply({ content: 'A ticket rendszer nincs beállítva. Kérj meg egy adminisztrátort, hogy futtassa a `/ticketsetup` parancsot.', flags: 64 });
    }

    const existing = db.prepare('SELECT * FROM tickets WHERE guildId = ? AND ownerId = ?')
      .get(interaction.guild.id, interaction.user.id);
    if (existing) {
      return interaction.reply({ content: `Már van nyitott ticketed: <#${existing.channelId}>`, flags: 64 });
    }

    const channel = await interaction.guild.channels.create({
      name: `ticket-${interaction.user.username}`,
      type: ChannelType.GuildText,
      parent: settings.ticketCategoryId,
      permissionOverwrites: [
        { id: interaction.guild.id, deny: [PermissionFlagsBits.ViewChannel] },
        { id: interaction.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] }
      ]
    });

    db.prepare('INSERT INTO tickets (channelId, guildId, ownerId, createdAt) VALUES (?, ?, ?, ?)')
      .run(channel.id, interaction.guild.id, interaction.user.id, Date.now());

    const embed = new EmbedBuilder()
      .setColor(config.colors.primary)
      .setTitle('🎫 Új ticket')
      .setDescription(`Üdv ${interaction.user}! Írd le a problémádat, egy csapattag hamarosan válaszol.`);

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('ticketclose:btn').setLabel('Bezárás').setStyle(ButtonStyle.Danger).setEmoji('🔒')
    );

    await channel.send({ content: `${interaction.user}`, embeds: [embed], components: [row] });
    await interaction.reply({ content: `✅ Ticket létrehozva: ${channel}`, flags: 64 });
  },

  ticketclose: async (interaction) => {
    if (interaction.customId !== 'ticketclose:btn') return;
    const ticket = db.prepare('SELECT * FROM tickets WHERE channelId = ?').get(interaction.channel.id);
    if (!ticket) return interaction.reply({ content: 'Ez a csatorna nem egy ticket.', flags: 64 });

    await interaction.reply('🔒 A ticket 5 másodperc múlva bezárul...');
    db.prepare('DELETE FROM tickets WHERE channelId = ?').run(interaction.channel.id);
    setTimeout(() => interaction.channel.delete().catch(() => {}), 5000);
  }
};
