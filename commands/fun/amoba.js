const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, MessageFlags } = require('discord.js');
const config = require('../../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('amoba')
    .setDescription('Indíts egy amőba játékot két játékos között.')
    .addUserOption(o => o.setName('ellenfel').setDescription('Ki ellen játssz').setRequired(true)),
  async execute(interaction) {
    const p1 = interaction.user;
    const p2 = interaction.options.getUser('ellenfel');
    if (p2.bot) return interaction.reply({ content: 'Bot ellen nem lehet játszani.', flags: MessageFlags.Ephemeral });
    if (p2.id === p1.id) return interaction.reply({ content: 'Magad ellen nem játszhatsz.', flags: MessageFlags.Ephemeral });

    const board = Array(9).fill(null);
    let turn = p1.id;

    function buildRows() {
      const rows = [];
      for (let r = 0; r < 3; r++) {
        const row = new ActionRowBuilder();
        for (let c = 0; c < 3; c++) {
          const idx = r * 3 + c;
          const val = board[idx];
          row.addComponents(
            new ButtonBuilder()
              .setCustomId(`amoba:${idx}`)
              .setLabel(val || '‎')
              .setStyle(val === 'X' ? ButtonStyle.Danger : val === 'O' ? ButtonStyle.Primary : ButtonStyle.Secondary)
              .setDisabled(!!val)
          );
        }
        rows.push(row);
      }
      return rows;
    }

    function checkWinner() {
      const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
      for (const [a,b,c] of lines) {
        if (board[a] && board[a] === board[b] && board[b] === board[c]) return board[a];
      }
      if (board.every(x => x)) return 'dontetlen';
      return null;
    }

    const embed = new EmbedBuilder()
      .setColor(config.colors.primary)
      .setDescription(`❌ ${p1} vs ⭕ ${p2}\nJelenlegi kör: <@${turn}>`);

    const reply = await interaction.reply({ embeds: [embed], components: buildRows(), fetchReply: true });

    const collector = reply.createMessageComponentCollector({ time: 300000 });

    collector.on('collect', async i => {
      if (i.user.id !== turn) return i.reply({ content: 'Nem te jössz!', flags: MessageFlags.Ephemeral });
      if (i.user.id !== p1.id && i.user.id !== p2.id) return i.reply({ content: 'Ez nem a te játékod.', flags: MessageFlags.Ephemeral });

      const idx = parseInt(i.customId.split(':')[1]);
      if (board[idx]) return i.deferUpdate();

      board[idx] = turn === p1.id ? 'X' : 'O';
      const winner = checkWinner();

      if (winner) {
        const winEmbed = new EmbedBuilder()
          .setColor(config.colors.success)
          .setDescription(winner === 'dontetlen' ? '🤝 Döntetlen!' : `🎉 <@${winner === 'X' ? p1.id : p2.id}> nyert!`);
        await i.update({ embeds: [winEmbed], components: buildRows() });
        collector.stop();
        return;
      }

      turn = turn === p1.id ? p2.id : p1.id;
      const updated = new EmbedBuilder()
        .setColor(config.colors.primary)
        .setDescription(`❌ ${p1} vs ⭕ ${p2}\nJelenlegi kör: <@${turn}>`);
      await i.update({ embeds: [updated], components: buildRows() });
    });
  }
};
