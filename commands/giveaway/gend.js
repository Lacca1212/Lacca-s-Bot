const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const { db } = require('../../database');
const { endGiveaway } = require('./gstart');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('gend')
    .setDescription('Azonnal befejezi a giveaway-t')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addStringOption(o => o.setName('uzenet_id').setDescription('A nyereményjáték üzenetének ID-ja').setRequired(true)),
  async execute(interaction) {
    const messageId = interaction.options.getString('uzenet_id');
    const g = db.prepare('SELECT * FROM giveaways WHERE messageId = ?').get(messageId);
    if (!g) return interaction.reply({ content: 'Nem található ilyen ID-jú nyereményjáték.', flags: MessageFlags.Ephemeral });
    if (g.ended) return interaction.reply({ content: 'Ez a nyereményjáték már véget ért.', flags: MessageFlags.Ephemeral });

    await endGiveaway(interaction.client, messageId);
    await interaction.reply({ content: '✅ A nyereményjáték lezárva.', flags: MessageFlags.Ephemeral });
  }
};
