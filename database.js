const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'lacca.sqlite'));
db.pragma('journal_mode = WAL');

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  guildId TEXT NOT NULL,
  userId TEXT NOT NULL,
  balance INTEGER DEFAULT 0,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 0,
  lastDaily INTEGER DEFAULT 0,
  lastXp INTEGER DEFAULT 0,
  marriedTo TEXT DEFAULT NULL,
  afk INTEGER DEFAULT 0,
  afkReason TEXT DEFAULT '',
  birthday TEXT DEFAULT NULL,
  PRIMARY KEY (guildId, userId)
);

CREATE TABLE IF NOT EXISTS warnings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  guildId TEXT NOT NULL,
  userId TEXT NOT NULL,
  moderatorId TEXT NOT NULL,
  reason TEXT NOT NULL,
  createdAt INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS guild_settings (
  guildId TEXT PRIMARY KEY,
  welcomeChannelId TEXT DEFAULT NULL,
  welcomeMessage TEXT DEFAULT NULL,
  byeChannelId TEXT DEFAULT NULL,
  byeMessage TEXT DEFAULT NULL,
  autoroleId TEXT DEFAULT NULL,
  counterChannelId TEXT DEFAULT NULL,
  counterFormat TEXT DEFAULT 'Tagok: {count}',
  ticketCategoryId TEXT DEFAULT NULL,
  logChannelId TEXT DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS sticky_messages (
  channelId TEXT PRIMARY KEY,
  guildId TEXT NOT NULL,
  content TEXT NOT NULL,
  lastMessageId TEXT DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS tickets (
  channelId TEXT PRIMARY KEY,
  guildId TEXT NOT NULL,
  ownerId TEXT NOT NULL,
  claimedBy TEXT DEFAULT NULL,
  createdAt INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS giveaways (
  messageId TEXT PRIMARY KEY,
  channelId TEXT NOT NULL,
  guildId TEXT NOT NULL,
  prize TEXT NOT NULL,
  winnerCount INTEGER NOT NULL,
  endsAt INTEGER NOT NULL,
  hostId TEXT NOT NULL,
  ended INTEGER DEFAULT 0
);
`);

function getUser(guildId, userId) {
  let row = db.prepare('SELECT * FROM users WHERE guildId = ? AND userId = ?').get(guildId, userId);
  if (!row) {
    db.prepare('INSERT INTO users (guildId, userId) VALUES (?, ?)').run(guildId, userId);
    row = db.prepare('SELECT * FROM users WHERE guildId = ? AND userId = ?').get(guildId, userId);
  }
  return row;
}

function updateUser(guildId, userId, fields) {
  getUser(guildId, userId);
  const keys = Object.keys(fields);
  if (keys.length === 0) return;
  const setClause = keys.map(k => `${k} = ?`).join(', ');
  const values = keys.map(k => fields[k]);
  db.prepare(`UPDATE users SET ${setClause} WHERE guildId = ? AND userId = ?`).run(...values, guildId, userId);
}

function getGuildSettings(guildId) {
  let row = db.prepare('SELECT * FROM guild_settings WHERE guildId = ?').get(guildId);
  if (!row) {
    db.prepare('INSERT INTO guild_settings (guildId) VALUES (?)').run(guildId);
    row = db.prepare('SELECT * FROM guild_settings WHERE guildId = ?').get(guildId);
  }
  return row;
}

function updateGuildSettings(guildId, fields) {
  getGuildSettings(guildId);
  const keys = Object.keys(fields);
  if (keys.length === 0) return;
  const setClause = keys.map(k => `${k} = ?`).join(', ');
  const values = keys.map(k => fields[k]);
  db.prepare(`UPDATE guild_settings SET ${setClause} WHERE guildId = ?`).run(...values, guildId);
}

module.exports = { db, getUser, updateUser, getGuildSettings, updateGuildSettings };
