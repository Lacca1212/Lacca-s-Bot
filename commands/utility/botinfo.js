const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('botinfo')
    .setDescription('Mutasd meg a bot információit'),
  async execute(interaction) {
    const client = interaction.client;
    const uptimeSec = Math.floor(client.uptime / 1000);
    const hours = Math.floor(uptimeSec / 3600);
    const minutes = Math.floor((uptimeSec % 3600) / 60);

    const embed = new EmbedBuilder()
      .setColor(config.colors.primary)
      .setTitle("Lacca's Bot")
      .setThumbnail(client.user.displayAvatarURL())
      .addFields(
        { name: 'Szerverek', value: `${client.guilds.cache.size}`, inline: true },
        { name: 'Üzemidő', value: `${hours}ó ${minutes}p`, inline: true },
        { name: 'Ping', value: `${client.ws.ping}ms`, inline: true },
        { name: 'Parancsok', value: `${client.commands.size}`, inline: true }
      );
    await interaction.reply({ embeds: [embed] });
  }
};
