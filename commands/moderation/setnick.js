const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setnick')
    .setDescription('Egy tag becenevének megváltoztatása')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames)
    .addUserOption(o => o.setName('felhasznalo').setDescription('A felhasználó').setRequired(true))
    .addStringOption(o => o.setName('nev').setDescription('Az új becenév (üresen hagyva törli)').setRequired(false)),
  async execute(interaction) {
    const user = interaction.options.getUser('felhasznalo');
    const nickname = interaction.options.getString('nev') || null;
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (!member) return interaction.reply({ content: 'Ez a felhasználó nincs a szerveren.', flags: MessageFlags.Ephemeral });

    await member.setNickname(nickname).catch(() => {
      return interaction.reply({ content: 'Nem sikerült megváltoztatni a becenevet (lehet magasabb jogú a tag).', flags: MessageFlags.Ephemeral });
    });
    await interaction.reply({ content: `✅ ${user.tag} beceneve megváltoztatva: ${nickname || '(törölve)'}` });
  }
};
