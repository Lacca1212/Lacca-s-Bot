const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Felhasználó információk lekérése')
    .addUserOption(o => o.setName('felhasznalo').setDescription('Kinek nézd meg (alapból a sajátod)').setRequired(false)),
  async execute(interaction) {
    const user = interaction.options.getUser('felhasznalo') || interaction.user;
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);

    const embed = new EmbedBuilder()
      .setColor(config.colors.primary)
      .setTitle(`${user.tag} adatai`)
      .setThumbnail(user.displayAvatarURL())
      .addFields(
        { name: 'ID', value: user.id, inline: true },
        { name: 'Fiók létrehozva', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:D>`, inline: true },
        { name: 'Csatlakozott', value: member ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:D>` : 'ismeretlen', inline: true },
        { name: 'Szerepkörök', value: member ? member.roles.cache.filter(r => r.id !== interaction.guild.id).map(r => r.toString()).join(', ') || 'nincs' : 'ismeretlen' }
      );
    await interaction.reply({ embeds: [embed] });
  }
};
