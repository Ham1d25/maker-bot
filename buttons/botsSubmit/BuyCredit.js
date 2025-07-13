const { Client, Collection, discord,GatewayIntentBits, Partials , EmbedBuilder, ApplicationCommandOptionType , Events , ActionRowBuilder , ButtonBuilder ,MessageAttachment, ButtonStyle , Message } = require("discord.js");
const { Database } = require("st.db")
const setting = new Database("/database/settingsdata/setting");
const usersdata = new Database(`/database/usersdata/usersdata`);
const prices = new Database("/database/settingsdata/prices");
const invoices = new Database("/database/settingsdata/invoices");
const tokens = new Database("/tokens/tokens")
const tier1subscriptions = new Database("/database/makers/tier1/subscriptions")
const creditDB = new Database("/Json-db/Bots/creditDB.json")
const fs = require('fs');

let credit = tokens.get(`credit`)
const path = require('path');
const { readdirSync } = require("fs");
;module.exports = {
  name: Events.InteractionCreate,
  /**
   * @param {Interaction} interaction
  */
  async execute(interaction){
    if (interaction.isModalSubmit()) {
        if(interaction.customId == "BuyCredit_Modal") {
            await interaction.deferReply({ephemeral:true})
            let userbalance = parseInt(usersdata.get(`balance_${interaction.user.id}_${interaction.guild.id}`))
            const Bot_token = interaction.fields.getTextInputValue(`Bot_token`)
            const Bot_prefix = interaction.fields.getTextInputValue(`Bot_prefix`)
            const client16 = new Client({intents: 32767, shards: "auto", partials: [Partials.Message, Partials.Channel, Partials.GuildMember,]});
            try{
                const owner = interaction.user.id
                let price1 = prices.get(`credit_price_${interaction.guild.id}`) || 15;
                price1 = parseInt(price1)
                function generateRandomCode() {
                    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
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
                const { REST } = require('@discordjs/rest');
const rest = new REST({ version: '10' }).setToken(Bot_token);
const { Routes } = require('discord-api-types/v10');
               client16.on("ready" , async() => {
                let doneembeduser = new EmbedBuilder()
                .setTitle(`**تم انشاء بوتك بنجاح**`)
                .setDescription(`**معلومات الفاتورة :**`)
                .addFields(
                    {
                        name:`**الفاتورة**`,value:`**\`${invoice}\`**`,inline:false
                    },
                    {
                        name:`**نوع البوت**`,value:`**\`كريدت وهمي\`**`,inline:false
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
                        type:`كريدت وهمي`,
                        token:`${Bot_token}`,
                        prefix:`${Bot_prefix}`,
                        userid:`${interaction.user.id}`,
                        guildid:`${interaction.guild.id}`,
                        serverid:`عام`,
                    price:price1
                })
                const newbalance = parseInt(userbalance) - parseInt(price1)
await usersdata.set(`balance_${interaction.user.id}_${interaction.guild.id}` , newbalance)
                const thebut = new ButtonBuilder().setLabel(`دعوة البوت`).setStyle(ButtonStyle.Link).setURL(`https://discord.com/api/oauth2/authorize?client_id=${client16.user.id}&permissions=8&scope=bot%20applications.commands`);const rowss = new ActionRowBuilder().addComponents(thebut);
                await interaction.user.send({embeds:[doneembeduser] , components:[rowss]})
            })
                let doneembedprove = new EmbedBuilder()
                .setColor(`Gold`)
                .setDescription(`**تم شراء بوت \`كريدت وهمي\` بواسطة : ${interaction.user}**`)
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
                client16.commands = new Collection();
                client16.events = new Collection();
                require("../../Bots/credit/handlers/events")(client16)
                require("../../events/requireBots/credit-commands")(client16);
                const folderPath = path.resolve(__dirname, '../../Bots/credit/slashcommand16');
                const prefix = Bot_prefix
                client16.creditSlashCommands = new Collection();
  const creditSlashCommands = [];
  const ascii = require("ascii-table");
  const table = new ascii("credit commands").setJustify();
  for (let folder of readdirSync(folderPath).filter(
      (folder) => !folder.includes(".")
      )) {
      for (let file of readdirSync(`${folderPath}/` + folder).filter((f) =>
      f.endsWith(".js")
      )) {
          let command = require(`${folderPath}/${folder}/${file}`);
          if (command) {
              creditSlashCommands.push(command.data.toJSON());
              client16.creditSlashCommands.set(command.data.name, command);
              if (command.data.name) {
                  table.addRow(`/${command.data.name}`, "🟢 Working");
                } else {
            table.addRow(`/${command.data.name}`, "🔴 Not Working");
          }
        }
    }
}


const folderPath3 = path.resolve(__dirname, '../../Bots/credit/handlers');
for (let file of readdirSync(folderPath3).filter(f => f.endsWith('.js'))) {
    const event = require(path.join(folderPath3, file))(client16);
}
client16.on('ready' , async() => {
    setInterval(async() => {
      let BroadcastTokenss = tokens.get(`credit`)
      let thiss = BroadcastTokenss.find(br => br.token == Bot_token)
      if(thiss) {
        if(thiss.timeleft <= 0) {
            console.log(`${client16.user.id} Ended`)
          await client16.destroy();
        }
      }
    }, 1000);
  })
client16.on("ready" , async() => {
    
    try {
        await rest.put(
            Routes.applicationCommands(client16.user.id),
            { body: creditSlashCommands },
            );
            
        } catch (error) {
            console.error(error)
        }
        
    });
    const folderPath2 = path.resolve(__dirname, '../../Bots/credit/events');
    
    for (let file of readdirSync(folderPath2).filter(f => f.endsWith('.js'))) {
        const event = require(path.join(folderPath2, file));
    }
    client16.on("interactionCreate" , async(interaction) => {
        if (interaction.isChatInputCommand()) {
            if(interaction.user.bot) return;
            
            const command = client16.creditSlashCommands.get(interaction.commandName);
            
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
    
    client16.on("messageCreate" , async(message) => {
        if(message.author.bot) return;
        if(message.content.startsWith(`${prefix}credit`) || message.content.startsWith(`${prefix}credits`) || message.content.startsWith(`c`)) {
          let userCredits = creditDB.get(`credits_${message.author.id}_${message.guild.id}`)
          if(!userCredits) {
              await creditDB.set(`credits_${message.author.id}_${message.guild.id}` , 0)
          }
          userCredits = creditDB.get(`credits_${message.author.id}_${message.guild.id}`)
          let userId = message.content.split(" ")[1]
          if(!userId) {
            return message.reply({content:`**:bank: |  ${message.author.username}, your account balance is \`$${userCredits}\`.**`})
          }
          let user = message.mentions.members.first() ?? await client16.users.fetch(userId)
          let amount = message.content.split(" ")[2]
          if(!amount) {
            let user2Credits = creditDB.get(`credits_${user.id ?? user.user.id}_${message.guild.id}`)
          if(!user2Credits) {
              await creditDB.set(`credits_${user.id ?? user.user.id}_${message.guild.id}` , 0)
          }
          user2Credits = creditDB.get(`credits_${user.id ?? user.user.id}_${message.guild.id}`)
            return message.reply({content:`**${user.username ?? user.user.username} :credit_card: balance is \`$${user2Credits}\`.**`})
          }
          let user2Credits = creditDB.get(`credits_${user.id ?? user.user.id}_${message.guild.id}`)
          if(!user2Credits) {
              await creditDB.set(`credits_${user.id ?? user.user.id}_${message.guild.id}` , 0)
          }
          user2Credits = creditDB.get(`credits_${user.id ?? user.user.id}_${message.guild.id}`)
          if(amount > userCredits) return message.reply({content:`**:thinking: | r9_9, Your balance is not enough for that!**`})
          const theTax = Math.floor(parseInt(amount) * (5 / 100))
          const theFinal = parseInt(amount) - parseInt(theTax)
          const theFinalNum = theFinal
          const randomCaptcha = getCaptcha();
          let {captcha , number} = randomCaptcha;
          let messageReply = await message.reply({content:`** ${message.author.username}, Transfer Fees: \`${theTax}\`, Amount :\`$${theFinalNum}\`**\ntype these numbers to confirm :` , files:[{name:`captcha.png` , attachment:`${captcha}`}]})
         setTimeout(() => {
          try {
            messageReply.delete().catch(async() => {return;});
          } catch  {
            return;
          }
         }, 15 * 1000);
          const filter = ((m => m.author.id == message.author.id))
          const messageCollect = message.channel.createMessageCollector({
            filter:filter,
            time:15 * 1000,
            max:1
          })
          messageCollect.on("collect" , async(msg) => {
            try {
            if(msg.content == number) {
              let newUser1 = parseInt(userCredits) - parseInt(amount)
              let newUser2 = parseInt(userCredits) + parseInt(theFinalNum)
              await creditDB.set(`credits_${user.id ?? user.user.id}_${message.guild.id}` , newUser2)
              await creditDB.set(`credits_${message.author.id}_${message.guild.id}` , newUser1)
              await msg.reply({content:`**:moneybag: | ${message.author.username}, has transferred \`$${theFinalNum}\` to ${user}**`})
              await messageReply.delete();
              return msg.delete();  
            }else {
              await messageReply.delete().catch(async() => {return;});
             return msg.delete().catch(async() => {return;});
            }
          } catch {
              return;
            }
          })
        }
        })
    client16.on("messageCreate" , async(message) => {
                      let client = message.client;
                      if (message.author.bot) return;
                      if (message.channel.type === 'dm') return;
                      
                      
                      if(!message.content.startsWith(prefix)) return;
                      const args = message.content.slice(prefix.length).trim().split(/ +/g); 
                      const cmd = args.shift().toLowerCase();
                      if(cmd.length == 0 ) return;
                      let command = client.commands.get(cmd)
                      if(!command) command = client16.commands.get(client.commandaliases.get(cmd));
                      
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
                  
                  await client16.login(Bot_token)
                  if(!credit) {

                    await tokens.add(`credit` , [{token:Bot_token,prefix:Bot_prefix,clientId:client16.user.id,owner:interaction.user.id,timeleft:2629744}])
                      

                }else {
                  await tokens.push(`credit` , [{token:Bot_token,prefix:Bot_prefix,clientId:client16.user.id,owner:interaction.user.id,timeleft:2629744}])
                    


              }
                  
                }catch(error){
                console.error(error)
                return interaction.editReply({content:`**قم بتفعيل الخيارات الثلاثة او التاكد من توكن البوت ثم اعد المحاولة**`})
            }
        }
    }
}
}