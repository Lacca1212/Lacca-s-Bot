const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const { getUser, updateUser } = require('../../database');
const config = require('../../config');

const items = [
  { id: 'vip', name: 'VIP szín szerepkör', price: 5000 },
  { id: 'badge', name: 'Egyedi jelvény', price: 1500 },
  { id: 'boost', name: '2x XP boost (24 óra)', price: 800 }
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('shop')
    .setDescription('Nyisd meg a bolt rendszert.')
    .addSubcommand(sub => sub.setName('list').setDescription('Elérhető termékek listázása'))
    .addSubcommand(sub => sub.setName('buy').setDescription('Termék vásárlása')
      .addStringOption(o => o.setName('termek').setDescription('Melyik terméket vedd meg').setRequired(true)
        .addChoices(...items.map(i => ({ name: i.name, value: i.id }))))),
  async execute(interaction) {
    const sub = interaction.options.getSubcommand();

    if (sub === 'list') {
      const embed = new EmbedBuilder()
        .setColor(config.colors.primary)
        .setTitle('🛒 Bolt')
        .setDescription(items.map(i => `**${i.name}** – ${i.price} coin`).join('\n'));
      return interaction.reply({ embeds: [embed] });
    }

    if (sub === 'buy') {
      const itemId = interaction.options.getString('termek');
      const item = items.find(i => i.id === itemId);
      const row = getUser(interaction.guild.id, interaction.user.id);

      if (row.balance < item.price) return interaction.reply({ content: 'Nincs elég coinod ehhez a termékhez.', flags: MessageFlags.Ephemeral });

      updateUser(interaction.guild.id, interaction.user.id, { balance: row.balance - item.price });
      return interaction.reply({ content: `✅ Megvetted: **${item.name}**! (Ehhez adminnak kézzel is be kell állítani a szerepkört/hatást.)` });
    }
  }
};
