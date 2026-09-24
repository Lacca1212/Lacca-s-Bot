const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('slowmode')
    .setDescription('Slowmode beállítása egy csatornán')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addIntegerOption(o => o.setName('masodperc').setDescription('Másodperc (0 = kikapcsolva)').setRequired(true).setMinValue(0).setMaxValue(21600))
    .addChannelOption(o => o.setName('csatorna').setDescription('Melyik csatornán (alapból ez)').setRequired(false)),
  async execute(interaction) {
    const seconds = interaction.options.getInteger('masodperc');
    const channel = interaction.options.getChannel('csatorna') || interaction.channel;
    await channel.setRateLimitPerUser(seconds);
    await interaction.reply({ content: seconds === 0 ? `✅ Slowmode kikapcsolva itt: ${channel}` : `🐌 Slowmode beállítva: ${seconds} másodperc itt: ${channel}` });
  }
};
