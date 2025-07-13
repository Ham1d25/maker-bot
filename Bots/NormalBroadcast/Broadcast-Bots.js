
  const { Client, Collection, discord,GatewayIntentBits, Partials , EmbedBuilder, ApplicationCommandOptionType , Events , ActionRowBuilder , ButtonBuilder ,MessageAttachment, ButtonStyle , Message } = require("discord.js");
const { Database } = require("st.db")
const Broadcast2DB = new Database("/Json-db/Bots/Broadcast2DB.json")
const tokens = new Database("/tokens/tokens")
const tier1subscriptions = new Database("/database/makers/tier1/subscriptions")


  let Broadcast2 = tokens.get('Broadcast2')
  if(!Broadcast2) return;

const path = require('path');
const { readdirSync } = require("fs");
let theowner;
Broadcast2.forEach(async(data) => {
  const { REST } = require('@discordjs/rest');
  const { Routes } = require('discord-api-types/v10');
  const { prefix , token , clientId , owner } = data;
  theowner = owner
  const client18 = new Client({intents: 32767, shards: "auto", partials: [Partials.Message, Partials.Channel, Partials.GuildMember,]});
  client18.commands = new Collection();
  require(`./handlers/events`)(client18);
  client18.events = new Collection();
  require(`../../events/requireBots/Broadcast-commands`)(client18);
  const rest = new REST({ version: '10' }).setToken(token);
  client18.on("ready" , async() => {

      try {
        await rest.put(
          Routes.applicationCommands(client18.user.id),
          { body: Broadcast2SlashCommands },
          );
          
        } catch (error) {
          console.error(error)
        }

    });
    require(`../Broadcast/handlers/events`)(client18)

  const folderPath = path.join(__dirname, 'slashcommand18');
  client18.Broadcast2SlashCommands = new Collection();
  const Broadcast2SlashCommands = [];
  const ascii = require("ascii-table");
  const table = new ascii("Broadcast2 commands").setJustify();
  for (let folder of readdirSync(folderPath).filter(
    (folder) => !folder.includes(".")
    )) {
      for (let file of readdirSync(`${folderPath}/` + folder).filter((f) =>
      f.endsWith(".js")
      )) {
        let command = require(`${folderPath}/${folder}/${file}`);
        if (command) {
          Broadcast2SlashCommands.push(command.data.toJSON());
          client18.Broadcast2SlashCommands.set(command.data.name, command);
          if (command.data.name) {
            table.addRow(`/${command.data.name}`, "🟢 Working");
          } else {
            table.addRow(`/${command.data.name}`, "🔴 Not Working");
          }
        }
  }
}



const folderPath2 = path.join(__dirname, 'commands18');

for(let foldeer of readdirSync(folderPath2).filter((folder) => !folder.includes("."))) {
  for(let fiee of(readdirSync(`${folderPath2}/${foldeer}`).filter((fi) => fi.endsWith(".js")))) {
    const commander = require(`${folderPath2}/${foldeer}/${fiee}`)
  }
}

require(`../../events/requireBots/normal-broadcast-commands`)(client18)
require("./handlers/events")(client18)

	for (let file of readdirSync('./events/').filter(f => f.endsWith('.js'))) {
		const event = require(`./events/${file}`);
	if (event.once) {
		client18.once(event.name, (...args) => event.execute(...args));
	} else {
		client18.on(event.name, (...args) => event.execute(...args));
	}
	}

client18.on('ready' , async() => {
  setInterval(async() => {
    let BroadcastTokenss = tokens.get(`Broadcast2`)
    let thiss = BroadcastTokenss.find(br => br.token == token)
    if(thiss) {
      if(thiss.timeleft <= 0) {
        await client18.destroy();
        console.log(`${clientId} Ended`)
      }
    }
  }, 1000);
})


  client18.on("interactionCreate" , async(interaction) => {
    if (interaction.isChatInputCommand()) {
      
	    if(interaction.user.bot) return;

      
      const command = client18.Broadcast2SlashCommands.get(interaction.commandName);
	    
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
			return
		}
    }
  } )

 









   client18.login(token)
   .catch(async(err) => {
    const filtered = Broadcast2.filter(bo => bo != data)
			await tokens.set(`Broadcast2` , filtered)
      console.log(`${clientId} Not working and removed `)
   });


})
