const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const config = require('../../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('oleles')
    .setDescription('Ölelj meg valakit!')
    .addUserOption(o => o.setName('felhasznalo').setDescription('Kit ölelj meg').setRequired(true)),
  async execute(interaction) {
    const target = interaction.options.getUser('felhasznalo');
    if (target.id === interaction.user.id) return interaction.reply({ content: 'Magadat nem tudod megölelni... vagy igen? 🤗', flags: MessageFlags.Ephemeral });

    const embed = new EmbedBuilder()
      .setColor(config.colors.primary)
      .setDescription(`🤗 **${interaction.user.username}** megölelte **${target.username}**-t!`);
    await interaction.reply({ embeds: [embed] });
  }
};
