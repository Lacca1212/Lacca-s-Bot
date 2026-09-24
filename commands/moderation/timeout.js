const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, MessageFlags } = require('discord.js');
const config = require('../../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Felhasználó némítása (timeout)')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(o => o.setName('felhasznalo').setDescription('A némítandó felhasználó').setRequired(true))
    .addIntegerOption(o => o.setName('perc').setDescription('Időtartam percben').setRequired(true).setMinValue(1).setMaxValue(40320))
    .addStringOption(o => o.setName('indok').setDescription('Indok').setRequired(false)),
  async execute(interaction) {
    const user = interaction.options.getUser('felhasznalo');
    const minutes = interaction.options.getInteger('perc');
    const reason = interaction.options.getString('indok') || 'Nincs megadva indok';
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);

    if (!member) return interaction.reply({ content: 'Ez a felhasználó nincs a szerveren.', flags: MessageFlags.Ephemeral });
    if (!member.moderatable) return interaction.reply({ content: 'Ezt a felhasználót nem tudom némítani.', flags: MessageFlags.Ephemeral });

    await member.timeout(minutes * 60 * 1000, reason);

    const embed = new EmbedBuilder()
      .setColor(config.colors.warning)
      .setTitle('Felhasználó elnémítva')
      .addFields(
        { name: 'Felhasználó', value: user.tag },
        { name: 'Időtartam', value: `${minutes} perc` },
        { name: 'Indok', value: reason }
      );

    await interaction.reply({ embeds: [embed] });
  }
};
