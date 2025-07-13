
  const { Client, Collection, discord,GatewayIntentBits, Partials , EmbedBuilder, ApplicationCommandOptionType , Events , ActionRowBuilder , ButtonBuilder ,MessageAttachment, ButtonStyle , Message, Attachment } = require("discord.js");
  const { Database } = require("st.db")
  const orderDB = new Database("/Json-db/Bots/orderDB.json")
  const tokens = new Database("/tokens/tokens")
  const tier1subscriptions = new Database("/database/makers/tier1/subscriptions")
  
  let order = tokens.get('order')
  if(!order) return;
  
  const path = require('path');
  const { readdirSync } = require("fs");
  let theowner;
  order.forEach(async(data) => {
    const { REST } = require('@discordjs/rest');
    const { Routes } = require('discord-api-types/v10');
    const { prefix , token , clientId , owner } = data;
    theowner = owner
    const client17 = new Client({intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.MessageContent], shards: "auto", partials: [Partials.Message, Partials.Channel, Partials.GuildMember,]});
    client17.commands = new Collection();
    require(`./handlers/events`)(client17);
    client17.events = new Collection();
    require(`../../events/requireBots/order-commands`)(client17);
    const rest = new REST({ version: '10' }).setToken(token);
    client17.on("ready" , async() => {
  
        try {
          await rest.put(
            Routes.applicationCommands(client17.user.id),
            { body: orderSlashCommands },
            );
            
          } catch (error) {
            console.error(error)
          }
  
      });
      require(`./handlers/events`)(client17)
  
    const folderPath = path.join(__dirname, 'slashcommand17');
    client17.orderSlashCommands = new Collection();
    const orderSlashCommands = [];
    const ascii = require("ascii-table");
    const table = new ascii("order commands").setJustify();
    for (let folder of readdirSync(folderPath).filter(
      (folder) => !folder.includes(".")
      )) {
        for (let file of readdirSync(`${folderPath}/` + folder).filter((f) =>
        f.endsWith(".js")
        )) {
          let command = require(`${folderPath}/${folder}/${file}`);
          if (command) {
            orderSlashCommands.push(command.data.toJSON());
            client17.orderSlashCommands.set(command.data.name, command);
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
  
  require(`../../events/requireBots/order-commands`)(client17)
  require("./handlers/events")(client17)
  require("./handlers/order")(client17)
  require(`./handlers/ticketDelete`)(client17);
  
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
      let BroadcastTokenss = tokens.get(`order`)
      let thiss = BroadcastTokenss.find(br => br.token == token)
      if(thiss) {
        if(thiss.timeleft <= 0) {
          await client17.destroy();
          console.log(`${clientId} Ended`)
        }
      }
    }, 1000);
  })
  
  client17.on("messageCreate" , async(message) => {
    if(message.author.bot) return;
    const line = orderDB.get(`line_${message.guild.id}`)
    const chan = orderDB.get(`order_rooms_${message.guild.id}`)
    const role = orderDB.get(`role_${message.guild.id}`)
    if(line && chan && role) {
     if(chan != message.channel.id) return;
      const button1 = new ButtonBuilder()
      .setCustomId(`order`)
      .setLabel(`اطلب العرض الان`)
      .setEmoji("🛒")
      .setStyle(ButtonStyle.Secondary)
      const row = new ActionRowBuilder().addComponents(button1)
      await message.channel.send({content:`${message.content}\n${line}`, components:[row]}).catch(() => {return interaction.reply({content:`**الرجاء التأكد من صلاحياتي**`})})
      return message.delete()
  
    }
  })
    client17.on("interactionCreate" , async(interaction) => {
      if (interaction.isChatInputCommand()) {
        
          if(interaction.user.bot) return;
  
        
        const command = client17.orderSlashCommands.get(interaction.commandName);
          
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
              console.error(`Error executing ${interaction.commandName}`);
              console.error(error);
          }
      }
    } )
  
    client17.on("messageCreate" , async(message) => {
      let client = message.client;
    if (message.author.bot) return;
    if (message.channel.type === 'dm') return;
  
  
    if(!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g); 
    const cmd = args.shift().toLowerCase();
    if(cmd.length == 0 ) return;
    let command = client.commands.get(cmd)
    if(!command) command = client17.commands.get(client.commandaliases.get(cmd));
  
    if(command) {
      if(command.ownersOnly) {
              if (owner != message.author.id) {
                return message.reply({content: `❗ ***لا تستطيع استخدام هذا الامر***`, ephemeral: true});
              }
      }
      if(command.cooldown) {
          
        if(cooldown.has(`${command.name}${message.author.id}`)) return message.reply({ embeds:[{description:`**عليك الانتظار\`${ms(cooldown.get(`${command.name}${message.author.id}`) - Date.now(), {long : true}).replace("minutes", `دقيقة`).replace("seconds", `ثانية`).replace("second", `ثانية`).replace("ms", `ملي ثانية`)}\` لكي تتمكن من استخدام الامر مجددا.**`}]}).then(msg => setTimeout(() => msg.delete(), cooldown.get(`${command.name}${message.author.id}`) - Date.now()))
        command.run(client, message, args)
        cooldown.set(`${command.name}${message.author.id}`, Date.now() + command.cooldown)
        setTimeout(() => {
          cooldown.delete(`${command.name}${message.author.id}`)
        }, command.cooldown);
    } else {
      command.run(client, message, args)
    }}});
  
     client17.login(token)
  
  
  
  })
  