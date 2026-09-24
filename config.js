require('dotenv').config();

module.exports = {
  token: process.env.DISCORD_TOKEN,
  clientId: process.env.CLIENT_ID,
  guildId: process.env.GUILD_ID,
  geminiApiKey: process.env.GEMINI_API_KEY,
  colors: {
    primary: 0x5865F2,
    success: 0x57F287,
    danger: 0xED4245,
    warning: 0xFEE75C
  },
  xp: {
    minPerMessage: 10,
    maxPerMessage: 20,
    cooldownSeconds: 60
  },
  economy: {
    dailyAmount: 100,
    startingBalance: 0
  }
};
