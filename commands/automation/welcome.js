const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const { updateGuildSettings } = require('../../database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('welcome')
    .setDescription('Üdvözlő rendszer engedélyezése vagy beállítása')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addChannelOption(o => o.setName('csatorna').setDescription('Melyik csatornába küldje').setRequired(true))
    .addStringOption(o => o.setName('uzenet').setDescription('Üzenet ({user}, {server}, {membercount} változók)').setRequired(false)),
  async execute(interaction) {
    const channel = interaction.options.getChannel('csatorna');
    const message = interaction.options.getString('uzenet');

    updateGuildSettings(interaction.guild.id, {
      welcomeChannelId: channel.id,
      welcomeMessage: message || 'Isten hozott {user} a(z) {server} szerveren! Már {membercount}. tag vagy.'
    });

    await interaction.reply({ content: `✅ Üdvözlő üzenetek mostantól ide mennek: ${channel}`, flags: MessageFlags.Ephemeral });
  }
};
