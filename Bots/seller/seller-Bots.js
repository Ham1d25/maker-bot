
  const { Client, Collection, discord,GatewayIntentBits, Partials , EmbedBuilder, ApplicationCommandOptionType , Events , ActionRowBuilder , ButtonBuilder ,MessageAttachment, ButtonStyle , Message, Attachment } = require("discord.js");
  const { Database } = require("st.db")
  const sellerDB = new Database("/Json-db/Bots/sellerDB.json")
  const tokens = new Database("/tokens/tokens")
  const tier1subscriptions = new Database("/database/makers/tier1/subscriptions")
  
  let seller = tokens.get('seller')
  if(!seller) return;
  
  const path = require('path');
  const { readdirSync } = require("fs");
  let theowner;
  seller.forEach(async(data) => {
    const { REST } = require('@discordjs/rest');
    const { Routes } = require('discord-api-types/v9');
    const { prefix , token , clientId , owner } = data;
    theowner = owner
    const client50 = new Client({intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.MessageContent], shards: "auto", partials: [Partials.Message, Partials.Channel, Partials.GuildMember,]});
    client50.commands = new Collection();
    require(`./handlers/events`)(client50);
    require(`./handlers/edit-project`)(client50);
    client50.events = new Collection();
    require(`../../events/requireBots/seller-commands`)(client50);
    const rest = new REST({ version: '9' }).setToken(token);
    client50.on("ready" , async() => {
  
        try {
          await rest.put(
            Routes.applicationCommands(client50.user.id),
            { body: sellerSlashCommands },
            );
            
          } catch (error) {
            console.error(error)
          }
  
      });
      require(`./handlers/events`)(client50)
  
    const folderPath = path.join(__dirname, 'slashcommand50');
    client50.sellerSlashCommands = new Collection();
    const sellerSlashCommands = [];
    const ascii = require("ascii-table");
    const table = new ascii("seller commands").setJustify();
    for (let folder of readdirSync(folderPath).filter(
      (folder) => !folder.includes(".")
      )) {
        for (let file of readdirSync(`${folderPath}/` + folder).filter((f) =>
        f.endsWith(".js")
        )) {
          let command = require(`${folderPath}/${folder}/${file}`);
          if (command) {
            sellerSlashCommands.push(command.data.toJSON());
            client50.sellerSlashCommands.set(command.data.name, command);
            if (command.data.name) {
              table.addRow(`/${command.data.name}`, "🟢 Working");
            } else {
              table.addRow(`/${command.data.name}`, "🔴 Not Working");
            }
          }
    }
  }
  
  
  
  const folderPath2 = path.join(__dirname, 'commands50');
  
  for(let foldeer of readdirSync(folderPath2).filter((folder) => !folder.includes("."))) {
    for(let fiee of(readdirSync(`${folderPath2}/${foldeer}`).filter((fi) => fi.endsWith(".js")))) {
      const commander = require(`${folderPath2}/${foldeer}/${fiee}`)
    }
  }
  
  require(`../../events/requireBots/seller-commands`)(client50)
  require("./handlers/events")(client50)
  
      for (let file of readdirSync('./events/').filter(f => f.endsWith('.js'))) {
          const event = require(`./events/${file}`);
      if (event.once) {
          client50.once(event.name, (...args) => event.execute(...args));
      } else {
          client50.on(event.name, (...args) => event.execute(...args));
      }
      }
      client50.on('ready' , async() => {
        setInterval(async() => {
          let BroadcastTokenss = tokens.get(`seller`)
          let thiss = BroadcastTokenss.find(br => br.token == token)
          if(thiss) {
            if(thiss.timeleft <= 0) {
              await client50.destroy();
              console.log(`${clientId} Ended`)
            }
          }
        }, 1000);
      })
 client50.on("interactionCreate" , async(interaction) => {
    if (interaction.isChatInputCommand()) {
      
	    if(interaction.user.bot) return;

      
      const command = client50.sellerSlashCommands.get(interaction.commandName);
	    
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
       client50.login(token)
       .catch(async(err) => {
        const filtered = seller.filter(bo => bo != data)
                await tokens.set(`seller` , filtered)
          console.log(`${clientId} Not working and removed `)
       });
    
    
    })
    