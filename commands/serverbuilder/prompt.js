const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, EmbedBuilder, MessageFlags } = require('discord.js');
const config = require('../../config');
const fetch = require('node-fetch');

const channelTypeMap = {
  text: ChannelType.GuildText,
  voice: ChannelType.GuildVoice,
  announcement: ChannelType.GuildAnnouncement,
  forum: ChannelType.GuildForum,
  stage: ChannelType.GuildStageVoice
};

const SYSTEM_PROMPT = `Te egy Discord szerver struktura tervezo asszisztens vagy.
A felhasznalo egy magyar nyelvu leirast ad arrol, hogy milyen legyen a szervere.
Valaszolj KIZAROLAG egy JSON objektummal, semmi mas szoveg, magyarazat vagy markdown korulotte (ne hasznalj \`\`\`json blokkot sem).

A JSON formatuma:
{
  "categories": [
    {
      "name": "KATEGORIA NEVE",
      "channels": [
        { "name": "csatorna-nev", "type": "text" },
        { "name": "Hangcsatorna Neve", "type": "voice" }
      ]
    }
  ]
}

Szabalyok:
- "type" erteke csak: "text", "voice", "announcement", "forum", "stage" lehet.
- A szoveges csatornak nevei kisbetusek es kotojellel legyenek elvalasztva (discord konvencio), pl. "altalanos-chat".
- A hangcsatornak es kategoriak neve lehet szep nagybetus/emoji-s forma.
- Csak azt hozd letre, amit a felhasznalo leirasa alapjan indokolt, ne tulzasba vive.
- Ne irj semmi mas szoveget a JSON-on kivul.`;

async function askGemini(description) {
  const model = 'gemini-2.0-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${config.geminiApiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{ role: 'user', parts: [{ text: description }] }],
      generationConfig: {
        temperature: 0.4,
        responseMimeType: 'application/json'
      }
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API hiba: ${response.status} - ${errText}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('') || '';
  const cleaned = text.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned);
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('prompt')
    .setDescription('Ird le szoveggel, milyen legyen a szerver, es a bot felepiti/rendezi a csatornakat')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addStringOption(o => o.setName('szoveg')
      .setDescription('Ird le, milyen kategoriak/csatornak legyenek a szerveren')
      .setRequired(true)),
  async execute(interaction) {
    if (!config.geminiApiKey) {
      return interaction.reply({ content: 'A `/prompt` parancshoz nincs beallitva GEMINI_API_KEY a bot .env fajljaban.', flags: MessageFlags.Ephemeral });
    }

    const description = interaction.options.getString('szoveg');
    await interaction.deferReply();

    let plan;
    try {
      plan = await askGemini(description);
    } catch (err) {
      console.error(err);
      return interaction.editReply('Hiba tortent a szerver terv generalasa kozben. Probald ujra, vagy fogalmazd at a leirast.');
    }

    const guild = interaction.guild;
    const existingCategories = guild.channels.cache.filter(c => c.type === ChannelType.GuildCategory);
    const created = [];
    const updated = [];

    for (const cat of plan.categories) {
      let category = existingCategories.find(c => c.name.toLowerCase() === cat.name.toLowerCase());

      if (!category) {
        category = await guild.channels.create({ name: cat.name, type: ChannelType.GuildCategory });
        created.push(`📁 ${cat.name}`);
      } else {
        updated.push(`📁 ${cat.name} (már létezett)`);
      }

      for (const ch of cat.channels) {
        const desiredType = channelTypeMap[ch.type] ?? ChannelType.GuildText;
        const existingChannel = guild.channels.cache.find(
          c => c.parentId === category.id && c.name.toLowerCase() === ch.name.toLowerCase()
        );

        if (!existingChannel) {
          await guild.channels.create({ name: ch.name, type: desiredType, parent: category.id });
          created.push(`  └ ${ch.name}`);
        } else {
          if (existingChannel.type !== desiredType) {
            updated.push(`  └ ${ch.name} (típusa eltér, kézi módosítás javasolt)`);
          } else {
            updated.push(`  └ ${ch.name} (már létezett)`);
          }
        }
      }
    }

    const embed = new EmbedBuilder()
      .setColor(config.colors.success)
      .setTitle('🏗️ Szerver felépítve a leírás alapján')
      .addFields(
        { name: 'Újonnan létrehozva', value: created.join('\n') || 'nincs' },
        { name: 'Már létező / érintetlen', value: updated.join('\n') || 'nincs' }
      );

    await interaction.editReply({ embeds: [embed] });
  }
};
