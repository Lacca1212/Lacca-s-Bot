const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('untimeout')
    .setDescription('Némítás feloldása')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(o => o.setName('felhasznalo').setDescription('A felhasználó').setRequired(true)),
  async execute(interaction) {
    const user = interaction.options.getUser('felhasznalo');
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (!member) return interaction.reply({ content: 'Ez a felhasználó nincs a szerveren.', flags: MessageFlags.Ephemeral });

    await member.timeout(null);
    await interaction.reply({ content: `✅ ${user.tag} némítása feloldva.` });
  }
};
