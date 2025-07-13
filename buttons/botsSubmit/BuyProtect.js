const { Client, Collection, discord,GatewayIntentBits, Partials , EmbedBuilder, ApplicationCommandOptionType , Events , ActionRowBuilder , ButtonBuilder ,MessageAttachment, ButtonStyle , Message } = require("discord.js");
const { Database } = require("st.db")
const setting = new Database("/database/settingsdata/setting");
const usersdata = new Database(`/database/usersdata/usersdata`);
const prices = new Database("/database/settingsdata/prices");
const invoices = new Database("/database/settingsdata/invoices");
const tokens = new Database("/tokens/tokens")
const tier1subscriptions = new Database("/database/makers/tier1/subscriptions")
const protectDB = new Database("/Json-db/Bots/protectDB.json")
const moment = require('moment')
const fs = require('fs');


let protect = tokens.get(`protect`)
const path = require('path');
const { readdirSync } = require("fs");
;module.exports = {
  name: Events.InteractionCreate,
  /**
   * @param {Interaction} interaction
  */
  async execute(interaction){
    if (interaction.isModalSubmit()) {
        if(interaction.customId == "BuyProtect_Modal") {
            await interaction.deferReply({ephemeral:true})
            let userbalance = parseInt(usersdata.get(`balance_${interaction.user.id}_${interaction.guild.id}`))
            
          const Bot_token = interaction.fields.getTextInputValue(`Bot_token`)
          const Bot_prefix = interaction.fields.getTextInputValue(`Bot_prefix`)
            
            const client19 = new Client({intents:32767, shards: "auto", partials: [Partials.Message, Partials.Channel, Partials.GuildMember,]});
            try{
              const owner = interaction.user.id
                let price1 = prices.get(`protect_price_${interaction.guild.id}`) || 20;
                price1 = parseInt(price1)
                
                function generateRandomCode() {
                    const characters = 'AprotectDEFGHIJKLMNOPQRSTUVWXYZaprotectdefghijklmnopqrstuvwxyz0123456789';
                    let code = '';
                    for (let i = 0; i < 12; i++) {
                      if (i > 0 && i % 4 === 0) {
                        code += '-';
                      }
                      const randomIndex = Math.floor(Math.random() * characters.length);
                      code += characters.charAt(randomIndex);
                    }
                    return code;
                  }
                  const invoice = generateRandomCode();
                let doneembeduser = new EmbedBuilder()
                .setTitle(`**تم انشاء بوتك بنجاح**`)
                .setDescription(`**معلومات الفاتورة :**`)
                .addFields(
                    {
                        name:`**الفاتورة**`,value:`**\`${invoice}\`**`,inline:false
                    },
                    {
                        name:`**نوع البوت**`,value:`**\`حماية\`**`,inline:false
                    },
                  {
                      name:`**توكن البوت**`,value:`**\`${Bot_token}\`**`,inline:false
                  },
                    {
                        name:`**البريفكس**`,value:`**\`${Bot_prefix}\`**`,inline:false
                    }
                )
                await invoices.set(`${invoice}_${interaction.guild.id}` , 
                {
                    type:`حماية`,
                    token:`${Bot_token}`,
                    prefix:`${Bot_prefix}`,
                    userid:`${interaction.user.id}`,
                    guildid:`${interaction.guild.id}`,
                    serverid:`عام`,
                    price:price1
                })
                const { REST } = require('@discordjs/rest');
                const rest = new REST({ version: '10' }).setToken(Bot_token);
                const { Routes } = require('discord-api-types/v10');
                client19.on('ready' , async() => {
                  const newbalance = parseInt(userbalance) - parseInt(price1)
                  await usersdata.set(`balance_${interaction.user.id}_${interaction.guild.id}` , newbalance)
                  const thebut = new ButtonBuilder().setLabel(`دعوة البوت`).setStyle(ButtonStyle.Link).setURL(`https://discord.com/api/oauth2/authorize?client_id=${client19.user.id}&permissions=8&scope=bot%20applications.commands`);const rowss = new ActionRowBuilder().addComponents(thebut);
                 await interaction.user.send({embeds:[doneembeduser] , components:[rowss]})
                })
                let doneembedprove = new EmbedBuilder()
                .setColor(`Gold`)
                .setDescription(`**تم شراء بوت \`حماية\` بواسطة : ${interaction.user}**`)
                .setTimestamp()
                let logroom =  setting.get(`log_room_${interaction.guild.id}`)
                let theroom = interaction.guild.channels.cache.find(ch => ch.id == logroom)
               await theroom.send({embeds:[doneembedprove]})
               let userbots = usersdata.get(`bots_${interaction.user.id}_${interaction.guild.id}`);
               if(!userbots) {
                await usersdata.set(`bots_${interaction.user.id}_${interaction.guild.id}` , 1)
               }else {
                userbots = userbots + 1
                await usersdata.set(`bots_${interaction.user.id}_${interaction.guild.id}` , userbots) 
               }
                await interaction.editReply({content:`**تم انشاء بوتك بنجاح وتم خصم \`${price1}\` من رصيدك**`})
                client19.commands = new Collection();
            client19.events = new Collection();
            require("../../Bots/protect/handlers/events")(client19)
            require("../../events/requireBots/protect-commands")(client19);
            const folderPath = path.resolve(__dirname, '../../Bots/protect/slashcommand19');
            const prefix = Bot_prefix
            client19.protectSlashCommands = new Collection();
  const protectSlashCommands = [];
  const ascii = require("ascii-table");
  const table = new ascii("protect commands").setJustify();
  for (let folder of readdirSync(folderPath).filter(
    (folder) => !folder.includes(".")
    )) {
      for (let file of readdirSync(`${folderPath}/` + folder).filter((f) =>
      f.endsWith(".js")
      )) {
        let command = require(`${folderPath}/${folder}/${file}`);
        if (command) {
          protectSlashCommands.push(command.data.toJSON());
          client19.protectSlashCommands.set(command.data.name, command);
          if (command.data.name) {
            table.addRow(`/${command.data.name}`, "🟢 Working");
          } else {
            table.addRow(`/${command.data.name}`, "🔴 Not Working");
          }
        }
  }
}

const folderPath3 = path.resolve(__dirname, '../../Bots/protect/handlers');
for (let file of readdirSync(folderPath3).filter(f => f.endsWith('.js'))) {
    const event = require(path.join(folderPath3, file))(client19);
}
            client19.on("ready" , async() => {

                try {
                  await rest.put(
                    Routes.applicationCommands(client19.user.id),
                    { body: protectSlashCommands },
                    );
                    
                  } catch (error) {
                    console.error(error)
                  }
          
              });
              const folderPath2 = path.resolve(__dirname, '../../Bots/protect/events');

            for (let file of readdirSync(folderPath2).filter(f => f.endsWith('.js'))) {
                const event = require(path.join(folderPath2, file));
            }
                client19.on("interactionCreate" , async(interaction) => {
                    if (interaction.isChatInputCommand()) {
                        if(interaction.user.bot) return;
                      
                      const command = client19.protectSlashCommands.get(interaction.commandName);
                        
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

                  client19.on('ready' , async() => {
                    setInterval(async() => {
                      let protectTokenss = tokens.get(`protect`)

                      let thiss = protectTokenss.find(br => br.token == Bot_token)
                      if(thiss) {
                        if(thiss.timeleft <= 0) {
                          console.log(`${client19.user.id} Ended`)
                          await client19.destroy();
                        }
                      }
                    }, 1000);
                  })
                
// بداية الحماية من البوتات
client19.on("guildMemberAdd" , async(member) => {
  let guild = client19.guilds.cache.first()
  if(protectDB.has(`antibots_status_${guild.id}`)) {
    let antibotsstatus = protectDB.get(`antibots_status_${guild.id}`)
    if(antibotsstatus == "on") {
      if(member.user.bot) {
        try {
          member.kick()
        } catch {
          return
        }
      }
    }
  }
})
// نهاية الحماية من البوتات

//-

// بداية الحماية من حذف الرومات
client19.on('ready' , async() => {
  const guild = client19.guilds.cache.first()
  const guildid = guild.id
  let status = protectDB.get(`antideleterooms_status_${guildid}`)
  if(!status)return;
  if(status == "off") return;
  setInterval(() => {
  const users = protectDB.get(`roomsdelete_users_${guildid}`)
    if(!users) return;
    if(users.length > 0) {
      users.forEach(async(user) => {
        const { userid , limit , newReset } = user;
        const currentTime = moment().format('YYYY-MM-DD');
        if(moment(currentTime).isSame(newReset) || moment(currentTime).isAfter(newReset)) {
          const newResetDate = moment().add(1 , 'day').format('YYYY-MM-DD')
          executordb = {userid:userid,limit:0,newReset:newResetDate}
          const index = users.findIndex(user => user.userid === userid);
      users[index] = executordb;
      await protectDB.set(`roomsdelete_users_${guildid}` , users)
        }
        let limitrooms = protectDB.get(`antideleterooms_limit_${guildid}`)
      if(limit > limitrooms) {
        let member = guild.members.cache.find(m => m.id == userid)
       try {
         member.kick()
       } catch  {
        return;
       }
      }
      })
      
    } 
  }, 6 * 1000);
})

client19.on('channelDelete' , async(channel) => {
  let guildid = channel.guild.id
  let status = protectDB.get(`antideleterooms_status_${guildid}`)
  if(!status)return;
  if(status == "off") return;
  const fetchedLogs = await channel.guild.fetchAuditLogs({
    limit: 1,
    type: AuditLogEvent.ChannelDelete
  });
  const channelDeleteLog = fetchedLogs.entries.first();
  const { executor } = channelDeleteLog;
  const users = protectDB.get(`roomsdelete_users_${guildid}`)
  const endTime = moment().add(1 , 'day').format('YYYY-MM-DD')
  if(users.length <= 0) {
    await protectDB.push(`roomsdelete_users_${guildid}` , {userid:executor.id , limit:1 , newReset:endTime})
    return;
  }
  let executordb = users.find(user => user.userid == executor.id)
  if(!executordb) {
      await protectDB.push(`roomsdelete_users_${guildid}` , {userid:executor.id , limit:1 , newReset:endTime})
      return;
  }
  let oldexecutorlimit = executordb.limit
  let newexecutorlimit = oldexecutorlimit + 1
  executordb = {userid:executor.id,limit:newexecutorlimit,newReset:newReset}
  const index = users.findIndex(user => user.userid === executor.id);
users[index] = executordb;
  let deletelimit = protectDB.get(`antideleterooms_limit_${guildid}`)
  if(newexecutorlimit > deletelimit) {
    let guild = client19.guilds.cache.find(gu => gu.id == guildid)
    let member = guild.members.cache.find(ex => ex.id == executor.id)
   try {
    member.kick()
   } catch  {
    return;
   }
    let filtered = users.filter(a => a.userid != executor.id)
    await protectDB.set(`roomsdelete_users_${guildid}` , filtered)
  } else {
    await protectDB.set(`roomsdelete_users_${guildid}` , users)
  }
})
// نهاية الحماية من حذف الرومات

//-

// بداية الحماية من حذف الرتب
client19.on('ready' , async() => {
  const guild = client19.guilds.cache.first()
  const guildid = guild.id
  let status = protectDB.get(`antideleteroles_status_${guildid}`)
  if(!status)return;
  if(status == "off") return;
  setInterval(() => {
  const users = protectDB.get(`rolesdelete_users_${guildid}`)
    if(!users) return;
    if(users.length > 0) {
      users.forEach(async(user) => {
        const { userid , limit , newReset } = user;
        const currentTime = moment().format('YYYY-MM-DD');
        if(moment(currentTime).isSame(newReset) || moment(currentTime).isAfter(newReset)) {
          const newResetDate = moment().add(1 , 'day').format('YYYY-MM-DD')
          executordb = {userid:userid,limit:0,newReset:newResetDate}
          const index = users.findIndex(user => user.userid === userid);
      users[index] = executordb;
      await protectDB.set(`rolesdelete_users_${guildid}` , users)
        }
        let limitrooms = protectDB.get(`antideleteroles_limit_${guildid}`)
      if(limit > limitrooms) {
        let member = guild.members.cache.find(m => m.id == userid)
       try {
         member.kick()
       } catch  {
        return;
       }
      }
      })
      
    } 
  }, 6 * 1000);
})

client19.on('roleDelete' , async(role) => {
  let guildid = role.guild.id
  let status = protectDB.get(`antideleteroles_status_${guildid}`)
  if(!status)return;
  if(status == "off") return;
  const fetchedLogs = await role.guild.fetchAuditLogs({
    limit: 1,
    type: AuditLogEvent.ChannelDelete
  });
  const channelDeleteLog = fetchedLogs.entries.first();
  const { executor } = channelDeleteLog;
  const users = protectDB.get(`rolesdelete_users_${guildid}`)
  const endTime = moment().add(1 , 'day').format('YYYY-MM-DD')
  if(users.length <= 0) {
    await protectDB.push(`rolesdelete_users_${guildid}` , {userid:executor.id , limit:1 , newReset:endTime})
    return;
  }
  let executordb = users.find(user => user.userid == executor.id)
  if(!executordb) {
      await protectDB.push(`rolesdelete_users_${guildid}` , {userid:executor.id , limit:1 , newReset:endTime})
      return;
  }
  let oldexecutorlimit = executordb.limit
  let newexecutorlimit = oldexecutorlimit + 1
  executordb = {userid:executor.id,limit:newexecutorlimit,newReset:newReset}
  const index = users.findIndex(user => user.userid === executor.id);
users[index] = executordb;
  let deletelimit = protectDB.get(`antideleteroles_limit_${guildid}`)
  if(newexecutorlimit > deletelimit) {
    let guild = client19.guilds.cache.find(gu => gu.id == guildid)
    let member = guild.members.cache.find(ex => ex.id == executor.id)
   try {
    member.kick()
   } catch  {
    return;
   }
    let filtered = users.filter(a => a.userid != executor.id)
    await protectDB.set(`rolesdelete_users_${guildid}` , filtered)
  } else {
    await protectDB.set(`rolesdelete_users_${guildid}` , users)
  }
})

// نهاية الحماية من حذف الرتب

//-

// بداية الحماية من البان
client19.on('ready' , async() => {
  const guild = client19.guilds.cache.first()
  const guildid = guild.id
  let status = protectDB.get(`ban_status_${guildid}`)
  if(!status)return;
  if(status == "off") return;
  setInterval(() => {
  const users = protectDB.get(`ban_users_${guildid}`)
    if(!users) return;
    if(users.length > 0) {
      users.forEach(async(user) => {
        const { userid , limit , newReset } = user;
        const currentTime = moment().format('YYYY-MM-DD');
        if(moment(currentTime).isSame(newReset) || moment(currentTime).isAfter(newReset)) {
          const newResetDate = moment().add(1 , 'day').format('YYYY-MM-DD')
          executordb = {userid:userid,limit:0,newReset:newResetDate}
          const index = users.findIndex(user => user.userid === userid);
      users[index] = executordb;
      await protectDB.set(`ban_users_${guildid}` , users)
        }
        let limitrooms = protectDB.get(`ban_limit_${guildid}`)
      if(limit > limitrooms) {
        let member = guild.members.cache.find(m => m.id == userid)
       try {
         member.kick()
       } catch  {
        return;
       }
      }
      })
      
    } 
  }, 6 * 1000);
})

client19.on('guildBanAdd' , async(member) => {
  let guildid = member.guild.id
  let status = protectDB.get(`ban_status_${guildid}`)
  if(!status)return;
  if(status == "off") return;
  const fetchedLogs = await member.guild.fetchAuditLogs({
    limit: 1,
    type: AuditLogEvent.MemberBanAdd
  });
  const channelDeleteLog = fetchedLogs.entries.first();
  const { executor } = channelDeleteLog;
  const users = protectDB.get(`ban_users_${guildid}`)
  const endTime = moment().add(1 , 'day').format('YYYY-MM-DD')
  if(users.length <= 0) {
    await protectDB.push(`ban_users_${guildid}` , {userid:executor.id , limit:1 , newReset:endTime})
    return;
  }
  let executordb = users.find(user => user.userid == executor.id)
  if(!executordb) {
      await protectDB.push(`ban_users_${guildid}` , {userid:executor.id , limit:1 , newReset:endTime})
      return;
  }
  let oldexecutorlimit = executordb.limit
  let newexecutorlimit = oldexecutorlimit + 1
  executordb = {userid:executor.id,limit:newexecutorlimit,newReset:newReset}
  const index = users.findIndex(user => user.userid === executor.id);
users[index] = executordb;
  let deletelimit = protectDB.get(`ban_limit_${guildid}`)
  if(newexecutorlimit > deletelimit) {
    let guild = client19.guilds.cache.find(gu => gu.id == guildid)
    let member = guild.members.cache.find(ex => ex.id == executor.id)
   try {
    member.kick()
   } catch  {
    return;
   }
    let filtered = users.filter(a => a.userid != executor.id)
    await protectDB.set(`ban_users_${guildid}` , filtered)
  } else {
    await protectDB.set(`ban_users_${guildid}` , users)
  }
})

client19.on('guildMemberRemove' , async(member) => {
  let guildid = member.guild.id
  let status = protectDB.get(`ban_status_${guildid}`)
  if(!status)return;
  if(status == "off") return;
  const fetchedLogs = await member.guild.fetchAuditLogs({
    limit: 1,
    type: AuditLogEvent.MemberKick
  });
  const channelDeleteLog = fetchedLogs.entries.first();
  const { executor } = channelDeleteLog;
  const users = protectDB.get(`ban_users_${guildid}`)
  const endTime = moment().add(1 , 'day').format('YYYY-MM-DD')
  if(users.length <= 0) {
    await protectDB.push(`ban_users_${guildid}` , {userid:executor.id , limit:1 , newReset:endTime})
    return;
  }
  let executordb = users.find(user => user.userid == executor.id)
  if(!executordb) {
      await protectDB.push(`ban_users_${guildid}` , {userid:executor.id , limit:1 , newReset:endTime})
      return;
  }
  let oldexecutorlimit = executordb.limit
  let newexecutorlimit = oldexecutorlimit + 1
  executordb = {userid:executor.id,limit:newexecutorlimit,newReset:newReset}
  const index = users.findIndex(user => user.userid === executor.id);
users[index] = executordb;
  let deletelimit = protectDB.get(`ban_limit_${guildid}`)
  if(newexecutorlimit > deletelimit) {
    let guild = client19.guilds.cache.find(gu => gu.id == guildid)
    let member = guild.members.cache.find(ex => ex.id == executor.id)
   try {
    member.kick()
   } catch  {
    return;
   }
    let filtered = users.filter(a => a.userid != executor.id)
    await protectDB.set(`ban_users_${guildid}` , filtered)
  } else {
    await protectDB.set(`ban_users_${guildid}` , users)
  }
})

                
                  await client19.login(Bot_token).catch(() => {return;})
                  if(!protect) {

                      await tokens.add(`protect` , [{token:Bot_token,prefix:Bot_prefix,clientId:client19.user.id,owner:interaction.user.id,timeleft:2629744}])


                  }else {
                      await tokens.push(`protect` , {token:Bot_token,prefix:Bot_prefix,clientId:client19.user.id,owner:interaction.user.id,timeleft:2629744})


                  }
        
            
            }catch(error){
                console.error(error)
                return interaction.editReply({content:`**قم بتفعيل الخيارات الثلاثة او التاكد من توكن البوت ثم اعد المحاولة**`})
            }
        }
    }
  }
}