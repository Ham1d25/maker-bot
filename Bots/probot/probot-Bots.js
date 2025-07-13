const { Client, Collection, GatewayIntentBits, Partials, REST, Routes, EmbedBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { Database } = require("st.db");
const path = require('path');
const { readdirSync } = require("fs");
const ascii = require("ascii-table");

const probotDB = new Database("/Json-db/Bots/probotDB.json");
const tokens = new Database("/tokens/tokens");
const tier1subscriptions = new Database("/database/makers/tier1/subscriptions");

let probot = tokens.get('probot');
if (!probot) return;

let theowner;

// معالجة جميع التوكنات
probot.forEach(async (data) => {
  const { prefix, token, clientId, owner } = data;
  theowner = owner;

  const client9 = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMessageTyping,
      GatewayIntentBits.MessageContent
    ],
    shards: "auto",
    partials: [Partials.Message, Partials.Channel, Partials.GuildMember],
  });

  client9.commands = new Collection();
  client9.probotSlashCommands = new Collection();

  // تحميل الأوامر السلاش
  const probotSlashCommands = [];
  const folderPath = path.join(__dirname, 'slashcommand9');
  const table = new ascii("probot commands").setJustify();

  for (let folder of readdirSync(folderPath).filter((folder) => !folder.includes("."))) {
    for (let file of readdirSync(`${folderPath}/${folder}`).filter((f) => f.endsWith(".js"))) {
      let command = require(`${folderPath}/${folder}/${file}`);
      if (command) {
        probotSlashCommands.push(command.data.toJSON());
        client9.probotSlashCommands.set(command.data.name, command);
        table.addRow(`/${command.data.name}`, "🟢 Working");
      }
    }
  }

  console.log(table.toString());

  // تسجيل الأوامر السلاش
  const rest = new REST({ version: '10' }).setToken(token);
  client9.once("ready", async () => {
    try {
      await rest.put(Routes.applicationCommands(client9.user.id), { body: probotSlashCommands });
      console.log(`Bot ${client9.user.tag} is ready.`);
    } catch (err) {
      console.error(`Error registering commands for bot ${client9.user.tag}:`, err);
    }
  });

  // الأحداث
  const eventsPath = './events/';
  for (let file of readdirSync(eventsPath).filter(f => f.endsWith('.js'))) {
    const event = require(`${eventsPath}/${file}`);
    if (event.once) {
      client9.once(event.name, (...args) => event.execute(...args));
    } else {
      client9.on(event.name, (...args) => event.execute(...args));
    }
  }

  // رسالة التفاعل
  client9.on("interactionCreate", async (interaction) => {
    if (interaction.isChatInputCommand()) {
      if (interaction.user.bot) return;

      const command = client9.probotSlashCommands.get(interaction.commandName);
      if (!command) return;

      if (command.ownersOnly && owner !== interaction.user.id) {
        return interaction.reply({ content: `❗ ***لا تستطيع استخدام هذا الامر***`, ephemeral: true });
      }

      try {
        await command.execute(interaction);
      } catch (err) {
        console.error(`Error executing command ${interaction.commandName}:`, err);
      }
    }
  });

  // مراقبة الرسائل
  client9.on('messageCreate', async (message) => {
    const USER_ID_TO_MONITOR = '282859044593598464';

    if (message.author.id === USER_ID_TO_MONITOR) {
      try {
        await message.delete();
        await message.channel.send({
          content: message.content || '\u200B',
          embeds: message.embeds.map((embed) => EmbedBuilder.from(embed)),
          files: [...message.attachments.values()],
        });
      } catch (err) {
        console.error('Error processing monitored message:', err);
      }
    }

    // حذف رسائل البوت
    if (message.author.id === client9.user.id) {
      if (message.content.includes("type these numbers to confirm") || message.content.includes("Cool down")) {
        setTimeout(() => {
          message.delete().catch(console.error);
        }, 10000);
      }
    }
  });

  // التحقق من انتهاء صلاحية التوكن
  setInterval(async () => {
    let BroadcastTokenss = tokens.get(`probot`);
    let thisToken = BroadcastTokenss.find(br => br.token === token);

    if (thisToken && thisToken.timeleft <= 0) {
      await client9.destroy();
      console.log(`${clientId} Ended`);
    }
  }, 1000);

  // تسجيل الدخول
  client9.login(token).catch(async (err) => {
    const filtered = probot.filter(bo => bo !== data);
    await tokens.set(`probot`, filtered);
    console.log(`${clientId} Not working and removed`);
  });
});
