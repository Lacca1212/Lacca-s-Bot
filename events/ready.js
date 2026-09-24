module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`Bejelentkezve mint ${client.user.tag}`);
    client.user.setActivity('/help | Lacca\'s Bot');
  }
};
