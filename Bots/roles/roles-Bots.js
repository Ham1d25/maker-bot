
  const { Client, Collection,StringSelectMenuOptionBuilder,StringSelectMenuBuilder, discord,GatewayIntentBits, PermissionsBitField,Partials , EmbedBuilder, ApplicationCommandOptionType , Events , ActionRowBuilder , ButtonBuilder ,MessageAttachment, ButtonStyle , Message, Embed } = require("discord.js");
const { Database } = require("st.db")
const rolesDB = new Database("/Json-db/Bots/rolesDB.json")
const tokens = new Database("/tokens/tokens")
const tier1subscriptions = new Database("/database/makers/tier1/subscriptions")
const moment = require('moment-timezone');
moment.tz.setDefault('Africa/Cairo');

let roles = tokens.get('roles')
if(!roles) return;

const path = require('path');
const { readdirSync } = require("fs");
roles.forEach(async(data) => {
  const { REST } = require('@discordjs/rest');
  const { Routes } = require('discord-api-types/v10');
  const { prefix , token , clientId , owner } = data;
  theowner = owner
  const client25 = new Client({intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.MessageContent], shards: "auto", partials: [Partials.Message, Partials.Channel, Partials.GuildMember,]});
  client25.commands = new Collection();
  require(`./handlers/events`)(client25);
  client25.events = new Collection();
  require(`../../events/requireBots/roles-commands`)(client25);
  const rest = new REST({ version: '10' }).setToken(token);
  client25.setMaxListeners(1000)

  client25.on("ready" , async() => {

      try {
        await rest.put(
          Routes.applicationCommands(client25.user.id),
          { body: rolesSlashCommands },
          );
          
        } catch (error) {
          console.error(error)
        }

    });
    require(`./handlers/events`)(client25)
  const folderPath = path.join(__dirname, 'slashcommand25');
  client25.rolesSlashCommands = new Collection();
  const rolesSlashCommands = [];
  const ascii = require("ascii-table");
  const table = new ascii("roles commands").setJustify();
  for (let folder of readdirSync(folderPath).filter(
    (folder) => !folder.includes(".")
    )) {
      for (let file of readdirSync(`${folderPath}/` + folder).filter((f) =>
      f.endsWith(".js")
      )) {
        let command = require(`${folderPath}/${folder}/${file}`);
        if (command) {
          rolesSlashCommands.push(command.data.toJSON());
          client25.rolesSlashCommands.set(command.data.name, command);
          if (command.data.name) {
            table.addRow(`/${command.data.name}`, "🟢 Working");
          } else {
            table.addRow(`/${command.data.name}`, "🔴 Not Working");
          }
        }
  }
}



const folderPath2 = path.join(__dirname, 'commands25');

for(let foldeer of readdirSync(folderPath2).filter((folder) => !folder.includes("."))) {
  for(let fiee of(readdirSync(`${folderPath2}/${foldeer}`).filter((fi) => fi.endsWith(".js")))) {
    const commander = require(`${folderPath2}/${foldeer}/${fiee}`)
  }
}

require(`../../events/requireBots/roles-commands`)(client25)
require("./handlers/events")(client25)

	for (let file of readdirSync('./events/').filter(f => f.endsWith('.js'))) {
		const event = require(`./events/${file}`);
	if (event.once) {
		client25.once(event.name, (...args) => event.execute(...args));
	} else {
		client25.on(event.name, (...args) => event.execute(...args));
	}
	}




  client25.on("interactionCreate" , async(interaction) => {
    if (interaction.isChatInputCommand()) {
      
	    if(interaction.user.bot) return;

      
      const command = client25.rolesSlashCommands.get(interaction.commandName);
	    
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
			console.log(error)
		}
    }
  } )

client25.on("messageCreate" , async(message) => {
  if(message.content == `${prefix}buy-role`) {
    if(!message.channel.name.startsWith(`ticket`)) return message.reply({content:`**الامر يعمل في التكت فقط**`})
    let recipient = await rolesDB.get(`recipient_${message.guild.id}`)
    let probot = await rolesDB.get(`probot_${message.guild.id}`)
   if(!recipient || !probot) return message.reply({content:`**لم يتم تحديد الاعدادت من قبل الاونر لكي يتم شراء رتبة**`})
   let roles = await rolesDB.get(`roles_${message.guild.id}`)
   if(!roles) {
       await rolesDB.set(`roles_${message.guild.id}` , [])
   }
    roles = await rolesDB.get(`roles_${message.guild.id}`)
    if(roles.length <= 0) return message.reply({content:`**لا يوجد رتب متوفرة للبيع**`})
    let embed1 = new EmbedBuilder()
.setTitle(`**الرجاء تحديد الرتبة التي تود شرائها**`)
.setTimestamp()
let row = new ActionRowBuilder()
const select = new StringSelectMenuBuilder()
.setCustomId('roles_select')
.setPlaceholder('حدد الرتبة التي تود شرائها')
roles.forEach(async(role) => {
    select.addOptions(
        new StringSelectMenuOptionBuilder()
            .setLabel(`${role.roleName}`)
            .setDescription(`سعر الرتبة : ${role.price}`)
            .setValue(`${role.roleName}`),
    )
    
})
row.addComponents(select)
return message.reply({content:`${message.author}`,embeds:[embed1], components:[row]})
  }
})


  client25.on("interactionCreate" , async(interaction) => {
    if(interaction.isStringSelectMenu()) {
      if(interaction.customId == "roles_select") {
        let roles = await rolesDB.get(`roles_${interaction.guild.id}`)
        let selected = interaction.values[0]
        if(selected == "endBuy") {
          await interaction.reply({content:`**تم الغاء عملية الشراء وسيتم غلق التكت في خلال 10 ثواني**`})
          await interaction.message.delete();
          setTimeout(() => {
              interaction.channel.delete();
          }, 10 * 1000);
        }
        else if(selected == "anotherBuy") {
          let embed1 = new EmbedBuilder()
          .setTitle(`**الرجاء تحديد الرتبة التي تود شرائها**`)
          .setTimestamp()
          let row = new ActionRowBuilder()
          const select = new StringSelectMenuBuilder()
          .setCustomId('roles_select')
          .setPlaceholder('حدد الرتبة التي تود شرائها')
          roles.forEach(async(role) => {
              select.addOptions(
                  new StringSelectMenuOptionBuilder()
                      .setLabel(`${role.roleName}`)
                      .setDescription(`سعر الرتبة : ${role.price}`)
                      .setValue(`${role.roleName}`),
              )
              
          })
          row.addComponents(select)
          await interaction.message.edit({embeds:[embed1], components:[row]})
          await interaction.update().catch(async() => {return;})

        }else {
          let roleFind = await roles.find(ro => ro.roleName == selected)
          let {price , roleName , roleId} = roleFind;
          let tax = Math.floor(parseInt(price) * (20 / 19) + 1)
          let recipient = await rolesDB.get(`recipient_${interaction.guild.id}`)
          let probot = await rolesDB.get(`probot_${interaction.guild.id}`)
          let embed1 = new EmbedBuilder()
          .setTitle(`**الرجاء التحويل لاكمال عملية الشراء**`)
          .setDescription(`**الرجاء التحويل الى <@${recipient}> لأكمال عملية الشراء\`\`\`#credit ${recipient} ${tax}\`\`\`لديك 3 دقائق لأكمال عملية الشراء**`)
          .setTimestamp()
          const select = new StringSelectMenuBuilder()
          .setCustomId('roles_select')
          .setPlaceholder('خيارات أضافية')
          select.addOptions(
            new StringSelectMenuOptionBuilder()
            .setLabel(`الألغاء`)
            .setDescription(`الغاء عملية الشراء وغلق التكت`)
            .setValue(`endBuy`),
            )
            let row = new ActionRowBuilder().addComponents(select)
          await interaction.message.edit({embeds:[embed1] , components:[row]})
          await interaction.update().catch(async() => {return;})

          const collectorFilter = m => (m.content.includes(price) && m.content.includes(price) && (m.content.includes(recipient) || m.content.includes(`<@${recipient}>`)) && m.author.id == probot)
           const collector = await interaction.channel.createMessageCollector({
            filter:collectorFilter,
            max: 1,
            time: 1000 * 60 * 3
        });
        collector.on("collect" , async() => {
          let theRoleFind = interaction.guild.roles.cache.find(ro => ro.id == roleId)
          await interaction.member.roles.add(theRoleFind)
          let embed1 = new EmbedBuilder()
          .setTitle(`**تم الشراء بنجاح**`)
          .setDescription(`**تمت عملية الشراء بنجاح وتم اعطائك الرتبة , يمكنك شراء رتبة اخرى او غلق التكت من الخيارات الاضافية**`)
          .setTimestamp()
          const select = new StringSelectMenuBuilder()
          .setCustomId('roles_select')
          .setPlaceholder('خيارات أضافية')
          select.addOptions(
            new StringSelectMenuOptionBuilder()
            .setLabel(`شراء رتبة اخرى`)
            .setDescription(`شراء رتبة اضافية مع الرتبة التي تم شرائها`)
            .setValue(`anotherBuy`),
            new StringSelectMenuOptionBuilder()
            .setLabel(`الانهاء`)
            .setDescription(`غلق التكت`)
            .setValue(`endBuy`),
            )
            let row1 = new ActionRowBuilder().addComponents(select)
            await interaction.message.edit({embeds:[embed1] , components:[row1]})
            await interaction.update().catch(async() => {return;})
        })
        }
      }

    }
  })



   client25.login(token)
   .catch(async(err) => {
    const filtered = roles.filter(bo => bo != data)
			await tokens.set(`roles` , filtered)
      console.log(`${clientId} Not working and removed `)
   });


})
