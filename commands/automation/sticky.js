const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const { db } = require('../../database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sticky')
    .setDescription('Sticky üzenet beállításai az aktuális csatornán')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addSubcommand(sub => sub.setName('set').setDescription('Sticky üzenet beállítása')
      .addStringOption(o => o.setName('szoveg').setDescription('A sticky üzenet szövege').setRequired(true)))
    .addSubcommand(sub => sub.setName('remove').setDescription('Sticky üzenet eltávolítása')),
  async execute(interaction) {
    const sub = interaction.options.getSubcommand();

    if (sub === 'set') {
      const text = interaction.options.getString('szoveg');
      db.prepare('INSERT INTO sticky_messages (channelId, guildId, content) VALUES (?, ?, ?) ON CONFLICT(channelId) DO UPDATE SET content = excluded.content')
        .run(interaction.channel.id, interaction.guild.id, text);
      const sent = await interaction.channel.send({ content: text });
      db.prepare('UPDATE sticky_messages SET lastMessageId = ? WHERE channelId = ?').run(sent.id, interaction.channel.id);
      return interaction.reply({ content: '✅ Sticky üzenet beállítva ezen a csatornán.', flags: MessageFlags.Ephemeral });
    }

    if (sub === 'remove') {
      db.prepare('DELETE FROM sticky_messages WHERE channelId = ?').run(interaction.channel.id);
      return interaction.reply({ content: '✅ Sticky üzenet eltávolítva.', flags: MessageFlags.Ephemeral });
    }
  }
};
