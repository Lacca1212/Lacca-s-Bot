const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { updateGuildSettings } = require('../../database');
const config = require('../../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticketsetup')
    .setDescription('Ticket rendszer beállítása és panel létrehozása')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addChannelOption(o => o.setName('kategoria').setDescription('A ticket csatornák kategóriája').setRequired(true))
    .addChannelOption(o => o.setName('panel_csatorna').setDescription('Hova kerüljön a panel üzenet').setRequired(true)),
  async execute(interaction) {
    const category = interaction.options.getChannel('kategoria');
    const panelChannel = interaction.options.getChannel('panel_csatorna');

    updateGuildSettings(interaction.guild.id, { ticketCategoryId: category.id });

    const embed = new EmbedBuilder()
      .setColor(config.colors.primary)
      .setTitle('🎫 Támogatás')
      .setDescription('Kattints a gombra egy ticket megnyitásához!');

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('ticket:open').setLabel('Ticket nyitása').setStyle(ButtonStyle.Primary).setEmoji('🎫')
    );

    await panelChannel.send({ embeds: [embed], components: [row] });
    await interaction.reply({ content: `✅ Ticket panel elküldve ide: ${panelChannel}`, flags: 64 });
  }
};
