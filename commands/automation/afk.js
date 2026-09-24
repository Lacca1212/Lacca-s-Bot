const { SlashCommandBuilder } = require('discord.js');
const { updateUser } = require('../../database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('afk')
    .setDescription('Állítsd be az AFK státuszodat.')
    .addStringOption(o => o.setName('ok').setDescription('Miért vagy AFK').setRequired(false)),
  async execute(interaction) {
    const reason = interaction.options.getString('ok') || 'nincs megadva ok';
    updateUser(interaction.guild.id, interaction.user.id, { afk: 1, afkReason: reason });
    await interaction.reply(`💤 ${interaction.user.username} mostantól AFK: ${reason}`);
  }
};
