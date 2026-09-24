const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const { getUser, updateUser } = require('../../database');
const config = require('../../config');

const symbols = ['🍒', '🍋', '🍊', '🍇', '💎', '7️⃣'];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('slot')
    .setDescription('Próbálj szerencsét a nyerőgépen!')
    .addIntegerOption(o => o.setName('tet').setDescription('Mennyi coint tegyél fel').setRequired(true).setMinValue(1)),
  async execute(interaction) {
    const bet = interaction.options.getInteger('tet');
    const row = getUser(interaction.guild.id, interaction.user.id);

    if (row.balance < bet) return interaction.reply({ content: 'Nincs elég coinod ehhez a téthez.', flags: MessageFlags.Ephemeral });

    const spin = [0, 0, 0].map(() => symbols[Math.floor(Math.random() * symbols.length)]);
    let winnings = 0;

    if (spin[0] === spin[1] && spin[1] === spin[2]) winnings = bet * 5;
    else if (spin[0] === spin[1] || spin[1] === spin[2] || spin[0] === spin[2]) winnings = Math.floor(bet * 1.5);
    else winnings = -bet;

    updateUser(interaction.guild.id, interaction.user.id, { balance: row.balance + winnings });

    const embed = new EmbedBuilder()
      .setColor(winnings > 0 ? config.colors.success : config.colors.danger)
      .setTitle('🎰 Nyerőgép')
      .setDescription(`${spin.join(' | ')}\n\n${winnings > 0 ? `🎉 Nyertél **${winnings}** coint!` : `😢 Vesztettél **${-winnings}** coint.`}`);
    await interaction.reply({ embeds: [embed] });
  }
};
