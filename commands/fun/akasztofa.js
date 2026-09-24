const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../config');

const words = ['discord', 'javascript', 'szerver', 'billentyuzet', 'kaposzta', 'programozas', 'elefant', 'kulcstarto'];

function render(word, guessed) {
  return word.split('').map(l => guessed.includes(l) ? l : '\\_').join(' ');
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('akasztofa')
    .setDescription('Indíts egy Akasztófa játékot.'),
  async execute(interaction) {
    const word = words[Math.floor(Math.random() * words.length)];
    const guessed = [];
    let lives = 6;

    const embed = new EmbedBuilder()
      .setColor(config.colors.primary)
      .setTitle('🎯 Akasztófa')
      .setDescription(`${render(word, guessed)}\n\nÉletek: ${lives}\nÍrj be egy betűt a csetbe! (60 másodperced van körönként)`);

    const msg = await interaction.reply({ embeds: [embed], fetchReply: true });

    const collector = interaction.channel.createMessageCollector({
      filter: m => m.author.id === interaction.user.id && m.content.length === 1,
      time: 120000
    });

    collector.on('collect', async m => {
      const letter = m.content.toLowerCase();
      m.delete().catch(() => {});
      if (guessed.includes(letter)) return;
      guessed.push(letter);
      if (!word.includes(letter)) lives--;

      const won = word.split('').every(l => guessed.includes(l));
      const lost = lives <= 0;

      const updated = new EmbedBuilder()
        .setColor(won ? config.colors.success : lost ? config.colors.danger : config.colors.primary)
        .setTitle('🎯 Akasztófa')
        .setDescription(won
          ? `🎉 Kitaláltad! A szó: **${word}**`
          : lost
            ? `💀 Vesztettél! A szó: **${word}**`
            : `${render(word, guessed)}\n\nÉletek: ${lives}\nKitalált betűk: ${guessed.join(', ') || '-'}`);

      await msg.edit({ embeds: [updated] }).catch(() => {});
      if (won || lost) collector.stop();
    });

    collector.on('end', (_, reason) => {
      if (reason === 'time') {
        msg.edit({ content: 'Lejárt az idő, a játék véget ért.' }).catch(() => {});
      }
    });
  }
};
