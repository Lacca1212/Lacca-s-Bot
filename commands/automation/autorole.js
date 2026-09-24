const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const { updateGuildSettings } = require('../../database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('autorole')
    .setDescription('AutoRole rendszer beállítása (új tagok automatikus szerepköre)')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addRoleOption(o => o.setName('szerepkor').setDescription('Melyik szerepkört kapja meg mindenki automatikusan').setRequired(true)),
  async execute(interaction) {
    const role = interaction.options.getRole('szerepkor');
    updateGuildSettings(interaction.guild.id, { autoroleId: role.id });
    await interaction.reply({ content: `✅ Az autorole beállítva: ${role}`, flags: MessageFlags.Ephemeral });
  }
};
