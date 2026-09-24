const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { db } = require('../../database');
const config = require('../../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Figyelmeztetés adása egy felhasználónak')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(o => o.setName('felhasznalo').setDescription('A figyelmeztetendő felhasználó').setRequired(true))
    .addStringOption(o => o.setName('indok').setDescription('A figyelmeztetés indoka').setRequired(true)),
  async execute(interaction) {
    const user = interaction.options.getUser('felhasznalo');
    const reason = interaction.options.getString('indok');

    db.prepare('INSERT INTO warnings (guildId, userId, moderatorId, reason, createdAt) VALUES (?, ?, ?, ?, ?)')
      .run(interaction.guild.id, user.id, interaction.user.id, reason, Date.now());

    const count = db.prepare('SELECT COUNT(*) as c FROM warnings WHERE guildId = ? AND userId = ?')
      .get(interaction.guild.id, user.id).c;

    const embed = new EmbedBuilder()
      .setColor(config.colors.warning)
      .setTitle('⚠️ Figyelmeztetés')
      .addFields(
        { name: 'Felhasználó', value: `${user.tag}` },
        { name: 'Indok', value: reason },
        { name: 'Összes figyelmeztetés', value: `${count}` }
      );

    await interaction.reply({ embeds: [embed] });
    user.send(`Figyelmeztetést kaptál a(z) **${interaction.guild.name}** szerveren. Indok: ${reason}`).catch(() => {});
  }
};
