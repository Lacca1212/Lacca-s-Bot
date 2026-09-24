const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const config = require('../../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('csok')
    .setDescription('Adj egy csókot valakinek!')
    .addUserOption(o => o.setName('felhasznalo').setDescription('Kinek adj csókot').setRequired(true)),
  async execute(interaction) {
    const target = interaction.options.getUser('felhasznalo');
    if (target.id === interaction.user.id) return interaction.reply({ content: 'Ez most fura lenne. 😳', flags: MessageFlags.Ephemeral });

    const embed = new EmbedBuilder()
      .setColor(0xFF69B4)
      .setDescription(`💋 **${interaction.user.username}** megcsókolta **${target.username}**-t!`);
    await interaction.reply({ embeds: [embed] });
  }
};
