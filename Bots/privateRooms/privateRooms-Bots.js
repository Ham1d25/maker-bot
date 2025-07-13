const { Client, Collection, GatewayIntentBits, Partials, EmbedBuilder } = require("discord.js");
const { Database } = require("st.db");
const path = require('path');
const { readdirSync } = require("fs");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const moment = require('moment');
const ms = require("ms");
const ascii = require("ascii-table");

const privateRoomsDB = new Database("/Json-db/Bots/privateRoomsDB.json");
const tokens = new Database("/tokens/tokens");
const rooms = new Database("/Json-db/Bots/privateRoomsDB.json");

const buyCooldown = new Collection();

let privateRooms = tokens.get('privateRooms');
if (!privateRooms) return;

privateRooms.forEach(async (data) => {
  const { prefix, token, clientId, owner } = data;

  const client22 = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMessageTyping,
      GatewayIntentBits.MessageContent
    ],
    shards: "auto",
    partials: [
      Partials.Message,
      Partials.Channel,
      Partials.GuildMember,
    ]
  });

  client22.commands = new Collection();
  client22.privateRoomsSlashCommands = new Collection();
  client22.setMaxListeners(1000);

  loadCommands(client22, prefix);
  loadSlashCommands(client22);

  client22.on("ready", async () => {
    await registerSlashCommands(client22, token);
    managePrivateRooms(client22);
  });

  client22.on("messageCreate", async (message) => {
    handleMessageCreate(client22, message, prefix);
  });

  client22.on("interactionCreate", async (interaction) => {
    handleInteractionCreate(client22, interaction, owner);
  });

  client22.login(token).catch(async (err) => {
    await removeInvalidBot(clientId, data);
  });
});

function loadCommands(client, prefix) {
  const commandsDir = path.join(__dirname, 'commands22');
  const table = new ascii('Prefix Commands').setJustify();
  readdirSync(commandsDir).filter(f => f.endsWith(`.js`)).forEach(file => {
    let command = require(`${commandsDir}/${file}`);
    if (command) {
      client.commands.set(command.name, command);
      table.addRow(`${prefix}${command.name}`, '🟢 Working');
    }
  });
}

function loadSlashCommands(client) {
  const folderPath = path.join(__dirname, 'slashcommand22');
  const table = new ascii("Private Rooms Commands").setJustify();
  readdirSync(folderPath).filter(folder => !folder.includes(".")).forEach(folder => {
    readdirSync(`${folderPath}/${folder}`).filter(file => file.endsWith(".js")).forEach(file => {
      let command = require(`${folderPath}/${folder}/${file}`);
      if (command) {
        client.privateRoomsSlashCommands.set(command.data.name, command);
        table.addRow(`/${command.data.name}`, '🟢 Working');
      }
    });
  });
}

async function registerSlashCommands(client, token) {
  const rest = new REST({ version: '10' }).setToken(token);
  try {
    await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: Array.from(client.privateRoomsSlashCommands.values()).map(command => command.data.toJSON()) }
    );
  } catch (error) {
    console.error(error);
  }
}

function handleMessageCreate(client, message, prefix) {
  if (message.author.bot || message.channel.type === 'dm' || !message.content.startsWith(prefix)) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();
  if (!cmd.length) return;
  let command = client.commands.get(cmd);
  if (!command) return;
  if (command.cooldown && buyCooldown.has(`${command.name}${message.author.id}`)) {
    return message.reply({ embeds: [{ description: `**عليك الانتظار ${ms(buyCooldown.get(`${command.name}${message.author.id}`) - Date.now(), { long: true })} لاستخدام الأمر مجددًا.**` }] })
      .then(msg => setTimeout(() => msg.delete(), buyCooldown.get(`${command.name}${message.author.id}`) - Date.now()));
  }
  command.run(client, message, args);
  if (command.cooldown) {
    buyCooldown.set(`${command.name}${message.author.id}`, Date.now() + command.cooldown);
    setTimeout(() => buyCooldown.delete(`${command.name}${message.author.id}`), command.cooldown);
  }
}

function handleInteractionCreate(client, interaction, owner) {
  if (interaction.isChatInputCommand()) {
    if (interaction.user.bot) return;
    const command = client.privateRoomsSlashCommands.get(interaction.commandName);
    if (!command) return;
    if (command.ownersOnly && owner !== interaction.user.id) {
      return interaction.reply({ content: `❗ ***لا تستطيع استخدام هذا الأمر***`, ephemeral: true });
    }
    command.execute(interaction);
  }
}

function managePrivateRooms(client) {
  setInterval(async () => {
    const guild = client.guilds.cache.first();
    if (!guild) return;
    const theRooms = await rooms.get(`rooms_${guild.id}`);
    if (!theRooms || theRooms.length <= 0) return;
    theRooms.forEach(async (room) => {
      room.timeleft -= 1;
      await rooms.set(`rooms_${guild.id}`, theRooms);
      if (room.timeleft === 86400) {
        notifyRoomExpiry(client, room, guild);
      }
      if (room.timeleft <= 0) {
        deleteRoom(client, room, guild);
      }
    });
  }, 1000);
}

async function notifyRoomExpiry(client, room, guild) {
  const theGuild = client.guilds.cache.get(room.guildid);
  const theRoom = theGuild.channels.cache.get(room.roomid);
  if (!theRoom) return;

  const embed = new EmbedBuilder()
    .setTimestamp(Date.now() + ms('1d'))
    .setTitle('**متبقي يوم واحد فقط على انتهاء الروم**')
    .setDescription('**الرجاء فتح تكت والتجديد والا سيتم حذف الروم بعد يوم واحد فقط**');

  await theRoom.send({ embeds: [embed] });
}

async function deleteRoom(client, room, guild) {
  const theGuild = client.guilds.cache.get(room.guildid);
  const theRoom = theGuild.channels.cache.get(room.roomid);
  if (theRoom) await theRoom.delete();

  const theOwner = await client.users.fetch(room.roomowner);
  const theUser = theGuild.members.cache.get(room.roomowner);

  const roleid = await db.get(`role_${guild.id}`);
  const theRole = theGuild.roles.cache.get(roleid);
  if (theUser && theRole) {
    await theUser.roles.remove(theRole).catch(() => {});
  }

  const filteredRooms = theRooms.filter(ro => ro.roomowner !== room.roomowner);
  await rooms.set(`rooms_${guild.id}`, filteredRooms);

  const embed = new EmbedBuilder()
    .setTimestamp(Date.now())
    .setTitle('**انتهى الروم الخاص بك**')
    .setDescription('**تم حذف رومك بسبب عدم التجديد في الوقت المناسب**');

  await theOwner.send({ embeds: [embed] }).catch(() => {});
}

async function removeInvalidBot(clientId, data) {
  const filtered = privateRooms.filter(bo => bo.clientId !== clientId);
  await tokens.set('privateRooms', filtered);
  console.log(`${clientId} Not working and removed`);
}