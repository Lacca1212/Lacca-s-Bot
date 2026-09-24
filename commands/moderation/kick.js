const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, MessageFlags } = require('discord.js');
const config = require('../../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Felhasználó kidobása')
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption(o => o.setName('felhasznalo').setDescription('A kidobandó felhasználó').setRequired(true))
    .addStringOption(o => o.setName('indok').setDescription('A kidobás indoka').setRequired(false)),
  async execute(interaction) {
    const user = interaction.options.getUser('felhasznalo');
    const reason = interaction.options.getString('indok') || 'Nincs megadva indok';
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);

    if (!member) return interaction.reply({ content: 'Ez a felhasználó nincs a szerveren.', flags: MessageFlags.Ephemeral });
    if (!member.kickable) return interaction.reply({ content: 'Ezt a felhasználót nem tudom kidobni.', flags: MessageFlags.Ephemeral });

    await member.kick(`${reason} | Moderátor: ${interaction.user.tag}`);

    const embed = new EmbedBuilder()
      .setColor(config.colors.warning)
      .setTitle('Felhasználó kidobva')
      .addFields(
        { name: 'Felhasználó', value: `${user.tag} (${user.id})` },
        { name: 'Moderátor', value: interaction.user.tag },
        { name: 'Indok', value: reason }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
