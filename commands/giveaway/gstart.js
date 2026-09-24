const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { db } = require('../../database');
const config = require('../../config');

function parseDuration(str) {
  const match = str.match(/^(\d+)(s|m|h|d)$/);
  if (!match) return null;
  const num = parseInt(match[1]);
  const unit = match[2];
  const mult = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
  return num * mult[unit];
}

async function endGiveaway(client, giveawayId) {
  const g = db.prepare('SELECT * FROM giveaways WHERE messageId = ?').get(giveawayId);
  if (!g || g.ended) return;

  const channel = await client.channels.fetch(g.channelId).catch(() => null);
  if (!channel) return;
  const message = await channel.messages.fetch(g.messageId).catch(() => null);
  if (!message) return;

  const reaction = message.reactions.cache.get('🎉');
  const users = reaction ? (await reaction.users.fetch()).filter(u => !u.bot) : new Map();
  const pool = [...users.values()];

  db.prepare('UPDATE giveaways SET ended = 1 WHERE messageId = ?').run(giveawayId);

  if (pool.length === 0) {
    return channel.send(`😢 Senki sem vett részt a(z) **${g.prize}** nyereményjátékban.`);
  }

  const winners = [];
  const poolCopy = [...pool];
  for (let i = 0; i < Math.min(g.winnerCount, poolCopy.length); i++) {
    const idx = Math.floor(Math.random() * poolCopy.length);
    winners.push(poolCopy.splice(idx, 1)[0]);
  }

  const embed = new EmbedBuilder()
    .setColor(config.colors.success)
    .setTitle('🎉 Nyereményjáték vége!')
    .setDescription(`Nyeremény: **${g.prize}**\nNyertes(ek): ${winners.map(w => w.toString()).join(', ')}`);

  channel.send({ embeds: [embed] });
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('gstart')
    .setDescription('Nyereményjáték indítása')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addStringOption(o => o.setName('idotartam').setDescription('Pl. 30s, 10m, 2h, 1d').setRequired(true))
    .addIntegerOption(o => o.setName('nyertesek').setDescription('Hány nyertes legyen').setRequired(true).setMinValue(1))
    .addStringOption(o => o.setName('nyeremeny').setDescription('Mi a nyeremény').setRequired(true)),
  endGiveaway,
  async execute(interaction) {
    const durationStr = interaction.options.getString('idotartam');
    const winnerCount = interaction.options.getInteger('nyertesek');
    const prize = interaction.options.getString('nyeremeny');

    const durationMs = parseDuration(durationStr);
    if (!durationMs) return interaction.reply({ content: 'Érvénytelen időformátum. Használj pl. 30s, 10m, 2h, 1d formátumot.', flags: 64 });

    const endsAt = Date.now() + durationMs;
    const embed = new EmbedBuilder()
      .setColor(config.colors.primary)
      .setTitle('🎉 Nyereményjáték!')
      .setDescription(`Nyeremény: **${prize}**\nNyertesek száma: ${winnerCount}\nVége: <t:${Math.floor(endsAt / 1000)}:R>\n\nReagálj 🎉-vel a részvételhez!`);

    const message = await interaction.channel.send({ embeds: [embed] });
    await message.react('🎉');

    db.prepare('INSERT INTO giveaways (messageId, channelId, guildId, prize, winnerCount, endsAt, hostId) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .run(message.id, interaction.channel.id, interaction.guild.id, prize, winnerCount, endsAt, interaction.user.id);

    setTimeout(() => endGiveaway(interaction.client, message.id), durationMs);

    await interaction.reply({ content: `✅ Nyereményjáték elindítva!`, flags: 64 });
  }
};
