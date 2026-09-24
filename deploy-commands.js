const fs = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');
const config = require('./config');

const commands = [];
const commandFolders = fs.readdirSync(path.join(__dirname, 'commands'));
for (const folder of commandFolders) {
  const folderPath = path.join(__dirname, 'commands', folder);
  const commandFiles = fs.readdirSync(folderPath).filter(f => f.endsWith('.js'));
  for (const file of commandFiles) {
    const command = require(path.join(folderPath, file));
    if (command.data) commands.push(command.data.toJSON());
  }
}

const rest = new REST({ version: '10' }).setToken(config.token);

(async () => {
  try {
    console.log(`Deploying ${commands.length} slash parancs...`);
    if (config.guildId) {
      await rest.put(
        Routes.applicationGuildCommands(config.clientId, config.guildId),
        { body: commands }
      );
      console.log('Guild parancsok telepitve (azonnal elerheto).');
    } else {
      await rest.put(
        Routes.applicationCommands(config.clientId),
        { body: commands }
      );
      console.log('Globalis parancsok telepitve (akar 1 orat is elviselhet, mire minden szerveren megjelenik).');
    }
  } catch (err) {
    console.error(err);
  }
})();
