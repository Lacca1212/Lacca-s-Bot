const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unlock')
    .setDescription('Csatorna zárolásának feloldása')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addChannelOption(o => o.setName('csatorna').setDescription('Melyik csatornát oldja fel (alapból ez)').setRequired(false)),
  async execute(interaction) {
    const channel = interaction.options.getChannel('csatorna') || interaction.channel;
    await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { SendMessages: null });
    await interaction.reply({ content: `🔓 ${channel} feloldva.` });
  }
};
