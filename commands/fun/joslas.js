const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../config');

const answers = {
  tanulas: ['Kiváló eredmények várnak rád.', 'Egy kis extra erőfeszítés kell.', 'Ne halogasd, most tanulj!', 'Sikeres vizsga előtt állsz.'],
  munka: ['Előléptetés jöhet hamarosan.', 'Új lehetőség kopogtat.', 'Türelem, a siker közel van.', 'Változás jön a munkádban.'],
  penz: ['Váratlan bevétel érkezik.', 'Spórolj most, később megéri.', 'Ne költs meggondolatlanul.', 'Anyagi stabilitás felé haladsz.'],
  szerelem: ['Valaki gondol most rád.', 'Új kapcsolat van kibontakozóban.', 'A jelenlegi kapcsolatod erősödni fog.', 'Légy nyitott az új ismerősökre.']
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('joslas')
    .setDescription('Jóslás: tanulás, munka, pénz, szerelem')
    .addStringOption(o => o.setName('tema').setDescription('Miről szóljon a jóslás').setRequired(true)
      .addChoices(
        { name: 'Tanulás', value: 'tanulas' },
        { name: 'Munka', value: 'munka' },
        { name: 'Pénz', value: 'penz' },
        { name: 'Szerelem', value: 'szerelem' }
      )),
  async execute(interaction) {
    const topic = interaction.options.getString('tema');
    const list = answers[topic];
    const result = list[Math.floor(Math.random() * list.length)];

    const embed = new EmbedBuilder()
      .setColor(config.colors.primary)
      .setTitle('🔮 Jóslás')
      .setDescription(result);
    await interaction.reply({ embeds: [embed] });
  }
};
