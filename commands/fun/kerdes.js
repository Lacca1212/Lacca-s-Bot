const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../config');

const answers = [
  'Igen, teljesen biztos.', 'Nem, semmiképp.', 'Talán, próbáld meg.', 'Kérdezz később újra.',
  'A jelek szerint igen.', 'Kétlem.', 'Egyértelműen igen!', 'Nem éri meg.'
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kerdes')
    .setDescription('Kérdezz egy kérdést és kapj választ!')
    .addStringOption(o => o.setName('kerdes').setDescription('A kérdésed').setRequired(true)),
  async execute(interaction) {
    const question = interaction.options.getString('kerdes');
    const answer = answers[Math.floor(Math.random() * answers.length)];

    const embed = new EmbedBuilder()
      .setColor(config.colors.primary)
      .addFields({ name: '❓ Kérdés', value: question }, { name: '🎱 Válasz', value: answer });
    await interaction.reply({ embeds: [embed] });
  }
};
