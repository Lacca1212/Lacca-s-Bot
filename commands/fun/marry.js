const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const { getUser, updateUser } = require('../../database');
const config = require('../../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('marry')
    .setDescription('Házasságkötés')
    .addUserOption(o => o.setName('felhasznalo').setDescription('Kivel köss házasságot').setRequired(true)),
  async execute(interaction) {
    const target = interaction.options.getUser('felhasznalo');
    if (target.id === interaction.user.id) return interaction.reply({ content: 'Magaddal nem házasodhatsz meg. 😅', flags: MessageFlags.Ephemeral });
    if (target.bot) return interaction.reply({ content: 'Bottal nem házasodhatsz meg.', flags: MessageFlags.Ephemeral });

    const me = getUser(interaction.guild.id, interaction.user.id);
    const them = getUser(interaction.guild.id, target.id);

    if (me.marriedTo) return interaction.reply({ content: 'Te már házas vagy! Válj el a `/valas` paranccsal.', flags: MessageFlags.Ephemeral });
    if (them.marriedTo) return interaction.reply({ content: `${target.username} már házas.`, flags: MessageFlags.Ephemeral });

    updateUser(interaction.guild.id, interaction.user.id, { marriedTo: target.id });
    updateUser(interaction.guild.id, target.id, { marriedTo: interaction.user.id });

    const embed = new EmbedBuilder()
      .setColor(0xFF69B4)
      .setDescription(`💍 **${interaction.user.username}** és **${target.username}** összeházasodtak! Gratulálunk!`);
    await interaction.reply({ embeds: [embed] });
  }
};
