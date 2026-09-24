const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const { updateUser, getUser } = require('../../database');
const config = require('../../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('birthday')
    .setDescription('Kezeld a globális születésnapodat.')
    .addSubcommand(sub => sub.setName('set').setDescription('Születésnap beállítása')
      .addStringOption(o => o.setName('datum').setDescription('Formátum: NN.HH (pl. 25.12)').setRequired(true)))
    .addSubcommand(sub => sub.setName('view').setDescription('Születésnap megtekintése')
      .addUserOption(o => o.setName('felhasznalo').setDescription('Kinek (alapból a sajátod)').setRequired(false))),
  async execute(interaction) {
    const sub = interaction.options.getSubcommand();

    if (sub === 'set') {
      const date = interaction.options.getString('datum');
      if (!/^\d{1,2}\.\d{1,2}$/.test(date)) {
        return interaction.reply({ content: 'Érvénytelen formátum. Használd: NN.HH, pl. 25.12', flags: MessageFlags.Ephemeral });
      }
      updateUser(interaction.guild.id, interaction.user.id, { birthday: date });
      return interaction.reply({ content: `✅ Születésnapod beállítva: ${date}` });
    }

    if (sub === 'view') {
      const target = interaction.options.getUser('felhasznalo') || interaction.user;
      const row = getUser(interaction.guild.id, target.id);
      const embed = new EmbedBuilder()
        .setColor(config.colors.primary)
        .setDescription(row.birthday ? `🎂 ${target.username} születésnapja: ${row.birthday}` : `${target.username} nem állította be a születésnapját.`);
      return interaction.reply({ embeds: [embed] });
    }
  }
};
