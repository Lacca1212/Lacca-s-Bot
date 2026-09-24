const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, MessageFlags } = require('discord.js');
const { db } = require('../../database');
const config = require('../../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warnings')
    .setDescription('Figyelmeztetések kezelése')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addSubcommand(sub => sub.setName('list').setDescription('Figyelmeztetések listázása')
      .addUserOption(o => o.setName('felhasznalo').setDescription('Felhasználó').setRequired(true)))
    .addSubcommand(sub => sub.setName('clear').setDescription('Összes figyelmeztetés törlése')
      .addUserOption(o => o.setName('felhasznalo').setDescription('Felhasználó').setRequired(true)))
    .addSubcommand(sub => sub.setName('remove').setDescription('Egy adott figyelmeztetés törlése')
      .addIntegerOption(o => o.setName('id').setDescription('A figyelmeztetés azonosítója').setRequired(true))),
  async execute(interaction) {
    const sub = interaction.options.getSubcommand();

    if (sub === 'list') {
      const user = interaction.options.getUser('felhasznalo');
      const rows = db.prepare('SELECT * FROM warnings WHERE guildId = ? AND userId = ? ORDER BY createdAt DESC')
        .all(interaction.guild.id, user.id);

      if (rows.length === 0) return interaction.reply({ content: `${user.tag} felhasználónak nincs figyelmeztetése.`, flags: MessageFlags.Ephemeral });

      const embed = new EmbedBuilder()
        .setColor(config.colors.warning)
        .setTitle(`Figyelmeztetések – ${user.tag}`)
        .setDescription(rows.map(r => `**#${r.id}** – ${r.reason} (<t:${Math.floor(r.createdAt / 1000)}:R>)`).join('\n'));

      return interaction.reply({ embeds: [embed] });
    }

    if (sub === 'clear') {
      const user = interaction.options.getUser('felhasznalo');
      db.prepare('DELETE FROM warnings WHERE guildId = ? AND userId = ?').run(interaction.guild.id, user.id);
      return interaction.reply({ content: `✅ ${user.tag} összes figyelmeztetése törölve.` });
    }

    if (sub === 'remove') {
      const id = interaction.options.getInteger('id');
      const row = db.prepare('SELECT * FROM warnings WHERE id = ? AND guildId = ?').get(id, interaction.guild.id);
      if (!row) return interaction.reply({ content: 'Nem található ilyen azonosítójú figyelmeztetés.', flags: MessageFlags.Ephemeral });
      db.prepare('DELETE FROM warnings WHERE id = ?').run(id);
      return interaction.reply({ content: `✅ A(z) #${id} figyelmeztetés törölve.` });
    }
  }
};
