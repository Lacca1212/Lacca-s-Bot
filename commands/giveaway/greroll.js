const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, MessageFlags } = require('discord.js');
const { db } = require('../../database');
const config = require('../../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('greroll')
    .setDescription('A legutóbbi nyereményjáték újrasorsolása')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addStringOption(o => o.setName('uzenet_id').setDescription('A nyereményjáték üzenetének ID-ja').setRequired(true)),
  async execute(interaction) {
    const messageId = interaction.options.getString('uzenet_id');
    const g = db.prepare('SELECT * FROM giveaways WHERE messageId = ?').get(messageId);
    if (!g) return interaction.reply({ content: 'Nem található ilyen ID-jú nyereményjáték.', flags: MessageFlags.Ephemeral });

    const channel = await interaction.client.channels.fetch(g.channelId).catch(() => null);
    const message = channel && await channel.messages.fetch(g.messageId).catch(() => null);
    if (!message) return interaction.reply({ content: 'Nem található az eredeti üzenet.', flags: MessageFlags.Ephemeral });

    const reaction = message.reactions.cache.get('🎉');
    const users = reaction ? (await reaction.users.fetch()).filter(u => !u.bot) : new Map();
    const pool = [...users.values()];

    if (pool.length === 0) return interaction.reply({ content: 'Nincs kiből újrasorsolni.', flags: MessageFlags.Ephemeral });

    const winner = pool[Math.floor(Math.random() * pool.length)];
    const embed = new EmbedBuilder()
      .setColor(config.colors.success)
      .setDescription(`🎉 Új nyertes a(z) **${g.prize}** nyereményéhez: ${winner}`);

    await interaction.reply({ embeds: [embed] });
  }
};
