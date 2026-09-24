const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Üzenetek törlése ebből a csatornából')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption(o => o.setName('mennyi').setDescription('Hány üzenetet töröljön (1-100)').setRequired(true).setMinValue(1).setMaxValue(100))
    .addUserOption(o => o.setName('felhasznalo').setDescription('Csak ettől a felhasználótól töröljön').setRequired(false)),
  async execute(interaction) {
    const amount = interaction.options.getInteger('mennyi');
    const user = interaction.options.getUser('felhasznalo');

    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const messages = await interaction.channel.messages.fetch({ limit: 100 });
    let toDelete = [...messages.values()];
    if (user) toDelete = toDelete.filter(m => m.author.id === user.id);
    toDelete = toDelete.slice(0, amount);

    const deleted = await interaction.channel.bulkDelete(toDelete, true).catch(() => []);
    await interaction.editReply({ content: `🗑️ ${deleted.size} üzenet törölve.` });
  }
};
