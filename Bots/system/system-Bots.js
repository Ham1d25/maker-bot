
  const { Client, Collection, discord,GatewayIntentBits, Partials , EmbedBuilder, ApplicationCommandOptionType , Events , ActionRowBuilder , ButtonBuilder ,MessageAttachment, ButtonStyle , Message, Attachment } = require("discord.js");
const { Database } = require("st.db")
const systemDB = new Database("/Json-db/Bots/systemDB.json")
const tokens = new Database("/tokens/tokens")
const tier1subscriptions = new Database("/database/makers/tier1/subscriptions")

let system = tokens.get('system')
if(!system) return;
const path = require('path');
const { readdirSync } = require("fs");
let theowner;
system.forEach(async(data) => {
  const { REST } = require('@discordjs/rest');
  const { Routes } = require('discord-api-types/v10');
  const { prefix , token , clientId , owner } = data;
  theowner = owner
  const client17 = new Client({intents:32767, shards: "auto", partials: [Partials.Message, Partials.Channel, Partials.GuildMember,]});
  client17.commands = new Collection();
  require(`./handlers/events`)(client17);
  client17.events = new Collection();
  require(`../../events/requireBots/system-commands`)(client17);
  const rest = new REST({ version: '10' }).setToken(token);
  client17.on("ready" , async() => {

      try {
        await rest.put(
          Routes.applicationCommands(client17.user.id),
          { body: systemSlashCommands },
          );
          
        } catch (error) {
          console.error(error)
          
        }

    });
    require(`../system/handlers/events`)(client17)

  const folderPath = path.join(__dirname, 'slashcommand17');
  client17.systemSlashCommands = new Collection();
  const systemSlashCommands = [];
  const ascii = require("ascii-table");
  const table = new ascii("system commands").setJustify();
  for (let folder of readdirSync(folderPath).filter(
    (folder) => !folder.includes(".")
    )) {
      for (let file of readdirSync(`${folderPath}/` + folder).filter((f) =>
      f.endsWith(".js")
      )) {
        let command = require(`${folderPath}/${folder}/${file}`);
        if (command) {
          systemSlashCommands.push(command.data.toJSON());
          client17.systemSlashCommands.set(command.data.name, command);
          if (command.data.name) {
            table.addRow(`/${command.data.name}`, "🟢 Working");
          } else {
            table.addRow(`/${command.data.name}`, "🔴 Not Working");
          }
        }
  }
}



const folderPath2 = path.join(__dirname, 'commands17');

for(let foldeer of readdirSync(folderPath2).filter((folder) => !folder.includes("."))) {
  for(let fiee of(readdirSync(`${folderPath2}/${foldeer}`).filter((fi) => fi.endsWith(".js")))) {
    const commander = require(`${folderPath2}/${foldeer}/${fiee}`)
  }
}

require(`../../events/requireBots/system-commands`)(client17)
require("./handlers/events")(client17)

	for (let file of readdirSync('./events/').filter(f => f.endsWith('.js'))) {
		const event = require(`./events/${file}`);
	if (event.once) {
		client17.once(event.name, (...args) => event.execute(...args));
	} else {
		client17.on(event.name, (...args) => event.execute(...args));
	}
	}

client17.on('ready' , async() => {
  setInterval(async() => {
    let BroadcastTokenss = tokens.get(`system`)
    let thiss = BroadcastTokenss.find(br => br.token == token)
    if(thiss) {
      if(thiss.timeleft <= 0) {
        await client17.destroy();
        console.log(`${clientId} Ended`)
      }
    }
  }, 1000);
})


  client17.on("interactionCreate" , async(interaction) => {
    if (interaction.isChatInputCommand()) {
      
	    if(interaction.user.bot) return;

      
      const command = client17.systemSlashCommands.get(interaction.commandName);
	    
      if (!command) {
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
        return;
		}
    }
  } )




client17.on("messageCreate" , async(message) => {
  if(message.author.bot) return;
  try {
    if(message.content == "-" || message.content == "خط") {
      const line = systemDB.get(`line_${message.guild.id}`)
      if(line) {
        await message.delete()
        return message.channel.send({content:`${line}`});
      }
    }
  } catch (error) {
    return;
  }
 
})

client17.on("messageCreate" , async(message) => {
  if(message.author.bot) return;
  const autoChannels = systemDB.get(`line_channels_${message.guild.id}`)
    if(autoChannels) {
      if(autoChannels.length > 0) {
        if(autoChannels.includes(message.channel.id)) {
          const line = systemDB.get(`line_${message.guild.id}`)
      if(line) {
        return message.channel.send({content:`${line}`});
        }
      }
      }
    }
})



   client17.login(token)
   .catch(async(err) => {
    const filtered = system.filter(bo => bo != data)
			await tokens.set(`system` , filtered)
      console.log(`${clientId} Not working and removed `)
   });


})
