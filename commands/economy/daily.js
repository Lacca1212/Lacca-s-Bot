const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const { getUser, updateUser } = require('../../database');
const config = require('../../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('daily')
    .setDescription('Napi jutalom felvétele'),
  async execute(interaction) {
    const row = getUser(interaction.guild.id, interaction.user.id);
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;

    if (now - row.lastDaily < dayMs) {
      const remaining = dayMs - (now - row.lastDaily);
      const hours = Math.floor(remaining / (60 * 60 * 1000));
      const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
      return interaction.reply({ content: `Már felvetted a napi jutalmat. Térj vissza ${hours}ó ${minutes}p múlva.`, flags: MessageFlags.Ephemeral });
    }

    const amount = config.economy.dailyAmount;
    updateUser(interaction.guild.id, interaction.user.id, { balance: row.balance + amount, lastDaily: now });

    const embed = new EmbedBuilder()
      .setColor(config.colors.success)
      .setDescription(`🎁 Felvetted a napi **${amount}** coin jutalmadat!`);
    await interaction.reply({ embeds: [embed] });
  }
};
