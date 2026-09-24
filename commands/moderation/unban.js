const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, MessageFlags } = require('discord.js');
const config = require('../../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Kitiltás feloldása')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addStringOption(o => o.setName('userid').setDescription('A felhasználó Discord ID-ja').setRequired(true)),
  async execute(interaction) {
    const userId = interaction.options.getString('userid');
    const banEntry = await interaction.guild.bans.fetch(userId).catch(() => null);
    if (!banEntry) return interaction.reply({ content: 'Ez a felhasználó nincs kitiltva.', flags: MessageFlags.Ephemeral });

    await interaction.guild.bans.remove(userId);

    const embed = new EmbedBuilder()
      .setColor(config.colors.success)
      .setDescription(`✅ **${banEntry.user.tag}** kitiltása feloldva.`);
    await interaction.reply({ embeds: [embed] });
  }
};
