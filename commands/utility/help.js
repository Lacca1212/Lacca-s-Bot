const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../config');

const categoryLabels = {
  moderation: '🛡️ Moderálás',
  fun: '🎉 Közösségi/Fun',
  economy: '💰 Gazdaság',
  leveling: '📈 Szint rendszer',
  utility: '🔧 Segédeszközök',
  tickets: '🎫 Ticket rendszer',
  giveaway: '🎁 Nyereményjáték',
  automation: '⚙️ Automatizmusok',
  serverbuilder: '🏗️ Szerver-építő'
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Megmutatja a bot parancsait!'),
  async execute(interaction) {
    const fs = require('fs');
    const path = require('path');
    const commandsPath = path.join(__dirname, '..');
    const folders = fs.readdirSync(commandsPath);

    const embed = new EmbedBuilder()
      .setColor(config.colors.primary)
      .setTitle("Lacca's Bot – Parancsok")
      .setThumbnail(interaction.client.user.displayAvatarURL());

    for (const folder of folders) {
      const files = fs.readdirSync(path.join(commandsPath, folder)).filter(f => f.endsWith('.js'));
      const names = files.map(f => {
        const cmd = require(path.join(commandsPath, folder, f));
        return `\`/${cmd.data.name}\``;
      });
      embed.addFields({ name: categoryLabels[folder] || folder, value: names.join(', ') });
    }

    await interaction.reply({ embeds: [embed] });
  }
};
