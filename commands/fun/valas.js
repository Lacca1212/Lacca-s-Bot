const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const { getUser, updateUser } = require('../../database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('valas')
    .setDescription('Válj el egy felhasználótól!'),
  async execute(interaction) {
    const me = getUser(interaction.guild.id, interaction.user.id);
    if (!me.marriedTo) return interaction.reply({ content: 'Te nem vagy házas.', flags: MessageFlags.Ephemeral });

    const partnerId = me.marriedTo;
    updateUser(interaction.guild.id, interaction.user.id, { marriedTo: null });
    updateUser(interaction.guild.id, partnerId, { marriedTo: null });

    const embed = new EmbedBuilder()
      .setColor(0x555555)
      .setDescription(`💔 **${interaction.user.username}** elvált <@${partnerId}>-tól.`);
    await interaction.reply({ embeds: [embed] });
  }
};
