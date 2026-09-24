const { Events, MessageFlags } = require('discord.js');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction, client) {
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;
      try {
        await command.execute(interaction, client);
      } catch (err) {
        console.error(err);
        const payload = { content: 'Hiba tortent a parancs vegrehajtasa kozben.', flags: MessageFlags.Ephemeral };
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp(payload).catch(() => {});
        } else {
          await interaction.reply(payload).catch(() => {});
        }
      }
      return;
    }

    if (interaction.isButton()) {
      const prefix = interaction.customId.split(':')[0];
      const handler = client.buttonHandlers && client.buttonHandlers[prefix];
      if (handler) {
        try {
          await handler(interaction, client);
        } catch (err) {
          console.error(err);
        }
      }
    }
  }
};
