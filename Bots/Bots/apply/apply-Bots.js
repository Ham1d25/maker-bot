
  const { Client, Collection, discord,GatewayIntentBits, Partials , EmbedBuilder, ApplicationCommandOptionType , Events , ActionRowBuilder , ButtonBuilder ,MessageAttachment, ButtonStyle , Message } = require("discord.js");
const { Database } = require("st.db")
const applyDB = new Database("/Json-db/Bots/applyDB.json")
const tokens = new Database("/tokens/tokens")
const tier1subscriptions = new Database("/database/makers/tier1/subscriptions")

let apply = tokens.get('apply')
if(!apply) return;

const path = require('path');
const { readdirSync } = require("fs");
let theowner;
apply.forEach(async(data) => {
  const { REST } = require('@discordjs/rest');
  const { Routes } = require('discord-api-types/v10');
  const { prefix , token , clientId , owner } = data;
  theowner = owner
  const client13 = new Client({intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.MessageContent], shards: "auto", partials: [Partials.Message, Partials.Channel, Partials.GuildMember,]});
  client13.commands = new Collection();
  require(`./handlers/events`)(client13);
  client13.events = new Collection();
  require(`../../events/requireBots/apply-commands`)(client13);
  const rest = new REST({ version: '10' }).setToken(token);
  client13.on("ready" , async() => {

      try {
        await rest.put(
          Routes.applicationCommands(client13.user.id),
          { body: applySlashCommands },
          );
          
        } catch (error) {
          console.error(error)
        }

    });
    require(`../apply/handlers/events`)(client13)
    require(`../apply/handlers/applyCreate`)(client13)
    require(`../apply/handlers/applyResult`)(client13)
    require(`../apply/handlers/applySubmit`)(client13)

  const folderPath = path.join(__dirname, 'slashcommand13');
  client13.applySlashCommands = new Collection();
  const applySlashCommands = [];
  const ascii = require("ascii-table");
  const table = new ascii("apply commands").setJustify();
  for (let folder of readdirSync(folderPath).filter(
    (folder) => !folder.includes(".")
    )) {
      for (let file of readdirSync(`${folderPath}/` + folder).filter((f) =>
      f.endsWith(".js")
      )) {
        let command = require(`${folderPath}/${folder}/${file}`);
        if (command) {
          applySlashCommands.push(command.data.toJSON());
          client13.applySlashCommands.set(command.data.name, command);
          if (command.data.name) {
            table.addRow(`/${command.data.name}`, "🟢 Working");
          } else {
            table.addRow(`/${command.data.name}`, "🔴 Not Working");
          }
        }
  }
}



const folderPath2 = path.join(__dirname, 'commands13');

for(let foldeer of readdirSync(folderPath2).filter((folder) => !folder.includes("."))) {
  for(let fiee of(readdirSync(`${folderPath2}/${foldeer}`).filter((fi) => fi.endsWith(".js")))) {
    const commander = require(`${folderPath2}/${foldeer}/${fiee}`)
  }
}

require(`../../events/requireBots/apply-commands`)(client13)
require("./handlers/events")(client13)

	for (let file of readdirSync('./events/').filter(f => f.endsWith('.js'))) {
		const event = require(`./events/${file}`);
	if (event.once) {
		client13.once(event.name, (...args) => event.execute(...args));
	} else {
		client13.on(event.name, (...args) => event.execute(...args));
	}
	}

client13.on('ready' , async() => {
  setInterval(async() => {
    let BroadcastTokenss = tokens.get(`apply`)
    let thiss = BroadcastTokenss.find(br => br.token == token)
    if(thiss) {
      if(thiss.timeleft <= 0) {
        await client13.destroy();
        console.log(`${clientId} Ended`)
      }
    }
  }, 1000);
})


  client13.on("interactionCreate" , async(interaction) => {
    if (interaction.isChatInputCommand()) {
      
	    if(interaction.user.bot) return;

      
      const command = client13.applySlashCommands.get(interaction.commandName);
	    
      if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
      }
      if (command.ownersOnly === true) {
        if (owner != interaction.user.id) {
          return interaction.reply({content: `❗ ***لا تستطيع استخدام هذا الامر***`, ephemeral: true});
        }
      }
      try {

        await command.execute(interaction);
      } catch (error) {
			return
		}
    }
  } )




   client13.login(token)
   });
