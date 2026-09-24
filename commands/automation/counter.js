const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, MessageFlags } = require('discord.js');
const { updateGuildSettings } = require('../../database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('counter')
    .setDescription('Számolós csatorna beállítása (Kezelőpanel)')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addStringOption(o => o.setName('format').setDescription('Formátum, pl. "Tagok: {count}"').setRequired(true)),
  async execute(interaction) {
    const format = interaction.options.getString('format');
    const channel = await interaction.guild.channels.create({
      name: format.replaceAll('{count}', interaction.guild.memberCount.toString()),
      type: ChannelType.GuildVoice,
      permissionOverwrites: [{ id: interaction.guild.id, deny: ['Connect'] }]
    });

    updateGuildSettings(interaction.guild.id, { counterChannelId: channel.id, counterFormat: format });
    await interaction.reply({ content: `✅ Számolós csatorna létrehozva: ${channel}`, flags: MessageFlags.Ephemeral });
  }
};
