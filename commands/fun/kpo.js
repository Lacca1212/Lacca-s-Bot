const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../config');

const options = ['ko', 'papir', 'ollo'];
const labels = { ko: '🪨 Kő', papir: '📄 Papír', ollo: '✂️ Olló' };

function decide(p1, p2) {
  if (p1 === p2) return 'dontetlen';
  if ((p1 === 'ko' && p2 === 'ollo') || (p1 === 'papir' && p2 === 'ko') || (p1 === 'ollo' && p2 === 'papir')) return 'p1';
  return 'p2';
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kpo')
    .setDescription('Kő-Papír-Olló játék!')
    .addStringOption(o => o.setName('valasztas').setDescription('Válassz').setRequired(true)
      .addChoices({ name: 'Kő', value: 'ko' }, { name: 'Papír', value: 'papir' }, { name: 'Olló', value: 'ollo' })),
  async execute(interaction) {
    const playerChoice = interaction.options.getString('valasztas');
    const botChoice = options[Math.floor(Math.random() * options.length)];
    const result = decide(playerChoice, botChoice);

    let resultText;
    if (result === 'dontetlen') resultText = '🤝 Döntetlen!';
    else if (result === 'p1') resultText = `🎉 **${interaction.user.username}** nyert!`;
    else resultText = '🤖 A bot nyert!';

    const embed = new EmbedBuilder()
      .setColor(config.colors.primary)
      .addFields(
        { name: 'Te választottad', value: labels[playerChoice], inline: true },
        { name: 'A bot választotta', value: labels[botChoice], inline: true },
        { name: 'Eredmény', value: resultText }
      );
    await interaction.reply({ embeds: [embed] });
  }
};
