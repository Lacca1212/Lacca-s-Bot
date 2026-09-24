const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, MessageFlags } = require('discord.js');
const config = require('../../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Kitiltás indoklással')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption(o => o.setName('felhasznalo').setDescription('A kitiltandó felhasználó').setRequired(true))
    .addStringOption(o => o.setName('indok').setDescription('A kitiltás indoka').setRequired(false)),
  async execute(interaction) {
    const user = interaction.options.getUser('felhasznalo');
    const reason = interaction.options.getString('indok') || 'Nincs megadva indok';
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);

    if (member && !member.bannable) {
      return interaction.reply({ content: 'Ezt a felhasználót nem tudom kitiltani (magasabb jogosultsága van).', flags: MessageFlags.Ephemeral });
    }

    await interaction.guild.bans.create(user.id, { reason: `${reason} | Moderátor: ${interaction.user.tag}` });

    const embed = new EmbedBuilder()
      .setColor(config.colors.danger)
      .setTitle('Felhasználó kitiltva')
      .addFields(
        { name: 'Felhasználó', value: `${user.tag} (${user.id})` },
        { name: 'Moderátor', value: interaction.user.tag },
        { name: 'Indok', value: reason }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
