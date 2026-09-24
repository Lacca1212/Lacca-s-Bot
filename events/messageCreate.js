const { getUser, updateUser, db } = require('../database');
const { calculateLevel } = require('../utils/xp');
const config = require('../config');
const { EmbedBuilder } = require('discord.js');

const xpCooldowns = new Map();

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    if (message.author.bot || !message.guild) return;

    // AFK visszaterés kezelese
    const authorRow = getUser(message.guild.id, message.author.id);
    if (authorRow.afk) {
      updateUser(message.guild.id, message.author.id, { afk: 0, afkReason: '' });
      message.reply({ content: `Üdv újra itt, ${message.author.username}! Levettem az AFK státuszt.` }).catch(() => {});
    }

    // AFK emlitesek jelzese
    for (const mention of message.mentions.users.values()) {
      if (mention.id === message.author.id) continue;
      const row = getUser(message.guild.id, mention.id);
      if (row.afk) {
        message.reply({ content: `${mention.username} jelenleg AFK: ${row.afkReason || 'nincs megadva ok'}` }).catch(() => {});
      }
    }

    // Sticky uzenet ujrakuldese
    const sticky = db.prepare('SELECT * FROM sticky_messages WHERE channelId = ?').get(message.channel.id);
    if (sticky) {
      if (sticky.lastMessageId) {
        const old = await message.channel.messages.fetch(sticky.lastMessageId).catch(() => null);
        if (old) old.delete().catch(() => {});
      }
      const sent = await message.channel.send({ content: sticky.content }).catch(() => null);
      if (sent) {
        db.prepare('UPDATE sticky_messages SET lastMessageId = ? WHERE channelId = ?').run(sent.id, message.channel.id);
      }
    }

    // XP rendszer
    const cooldownKey = `${message.guild.id}-${message.author.id}`;
    const now = Date.now();
    const lastXp = xpCooldowns.get(cooldownKey) || 0;
    if (now - lastXp < config.xp.cooldownSeconds * 1000) return;
    xpCooldowns.set(cooldownKey, now);

    const gained = Math.floor(Math.random() * (config.xp.maxPerMessage - config.xp.minPerMessage + 1)) + config.xp.minPerMessage;
    const newXp = authorRow.xp + gained;
    const oldLevel = authorRow.level;
    const newLevel = calculateLevel(newXp);

    updateUser(message.guild.id, message.author.id, { xp: newXp, level: newLevel });

    if (newLevel > oldLevel) {
      const embed = new EmbedBuilder()
        .setColor(config.colors.success)
        .setDescription(`🎉 Gratulálok ${message.author}, elérted a **${newLevel}.** szintet!`);
      message.channel.send({ embeds: [embed] }).catch(() => {});
    }
  }
};
