const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const { updateGuildSettings } = require('../../database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bye')
    .setDescription('Búcsúzó rendszer engedélyezése vagy beállítása')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addChannelOption(o => o.setName('csatorna').setDescription('Melyik csatornába küldje').setRequired(true))
    .addStringOption(o => o.setName('uzenet').setDescription('Üzenet ({user}, {server}, {membercount} változók)').setRequired(false)),
  async execute(interaction) {
    const channel = interaction.options.getChannel('csatorna');
    const message = interaction.options.getString('uzenet');

    updateGuildSettings(interaction.guild.id, {
      byeChannelId: channel.id,
      byeMessage: message || '{user} elhagyta a szervert. Most {membercount} tag van.'
    });

    await interaction.reply({ content: `✅ Búcsúzó üzenetek mostantól ide mennek: ${channel}`, flags: MessageFlags.Ephemeral });
  }
};
