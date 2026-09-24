const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lock')
    .setDescription('Csatorna zárolása (üzenetküldés letiltása @everyone számára)')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addChannelOption(o => o.setName('csatorna').setDescription('Melyik csatornát zárja (alapból ez)').setRequired(false)),
  async execute(interaction) {
    const channel = interaction.options.getChannel('csatorna') || interaction.channel;
    await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { SendMessages: false });
    await interaction.reply({ content: `🔒 ${channel} zárolva.` });
  }
};
