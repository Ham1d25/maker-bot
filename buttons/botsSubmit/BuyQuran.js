const { Client, Collection, discord,GatewayIntentBits, Partials , EmbedBuilder, ApplicationCommandOptionType , Events , ActionRowBuilder , ButtonBuilder ,MessageAttachment, ButtonStyle , Message } = require("discord.js");
const { Database } = require("st.db")
const setting = new Database("/database/settingsdata/setting");
const usersdata = new Database(`/database/usersdata/usersdata`);
const prices = new Database("/database/settingsdata/prices");
const invoices = new Database("/database/settingsdata/invoices");
const tokens = new Database("/tokens/tokens")
const tier1subscriptions = new Database("/database/makers/tier1/subscriptions")
const quranDB = new Database("/Json-db/Bots/quranDB.json")
const ytdl = require('ytdl-core');
const { joinVoiceChannel,getVoiceConnection, createAudioPlayer, createAudioResource, NoSubscriberBehavior } = require('@discordjs/voice');

const path = require('path');
const { readdirSync } = require("fs");
;module.exports = {
  name: Events.InteractionCreate,
  /**
   * @param {Interaction} interaction
  */
  async execute(interaction){
    if (interaction.isModalSubmit()) {
        if(interaction.customId == "BuyQuran_Modal") {
            await interaction.deferReply({ephemeral:true})
            let userbalance = parseInt(usersdata.get(`balance_${interaction.user.id}_${interaction.guild.id}`))
           

          const Bot_token = interaction.fields.getTextInputValue(`Bot_token`)
          const Bot_prefix = interaction.fields.getTextInputValue(`Bot_prefix`)
            
            const client26 = new Client({intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.MessageContent], shards: "auto", partials: [Partials.Message, Partials.Channel, Partials.GuildMember,]});
            
            try{
              const owner = interaction.user.id
                let price1 = prices.get(`quran_price_${interaction.guild.id}`) || 1;
                price1 = parseInt(price1)
                
                function generateRandomCode() {
                    const characters = 'AquranDEFGHIJKLMNOPQRSTUVWXYZaqurandefghijklmnopqrstuvwxyz0123456789';
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
                        name:`**نوع البوت**`,value:`**\`قرأن\`**`,inline:false
                    },
                  { name:`**توكن البوت**`,value:`**\`${Bot_token}\`**`,inline:false },
                    {
                      
                        name:`**البريفكس**`,value:`**\`${Bot_prefix}\`**`,inline:false
                    }
                )
                await invoices.set(`${invoice}_${interaction.guild.id}` , 
                {
                    type:`قرأن`,
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
                client26.on('ready' , async() => {
                  const newbalance = parseInt(userbalance) - parseInt(price1)
                  await usersdata.set(`balance_${interaction.user.id}_${interaction.guild.id}` , newbalance)
                  const thebut = new ButtonBuilder().setLabel(`دعوة البوت`).setStyle(ButtonStyle.Link).setURL(`https://discord.com/api/oauth2/authorize?client_id=${client26.user.id}&permissions=8&scope=bot%20applications.commands`);const rowss = new ActionRowBuilder().addComponents(thebut);
                 await interaction.user.send({embeds:[doneembeduser] , components:[rowss]})
                })
                let doneembedprove = new EmbedBuilder()
                .setColor(`Gold`)
                .setDescription(`**تم شراء بوت \`قرأن\` بواسطة : ${interaction.user}**`)
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
                client26.commands = new Collection();
            client26.events = new Collection();
            const folderPath = path.resolve(__dirname, '../../Bots/quran/slashcommand26');
            const prefix = Bot_prefix
            client26.quranSlashCommands = new Collection();
  const quranSlashCommands = [];
  const ascii = require("ascii-table");
  const table = new ascii("quran commands").setJustify();
  for (let folder of readdirSync(folderPath).filter(
    (folder) => !folder.includes(".")
    )) {
      for (let file of readdirSync(`${folderPath}/` + folder).filter((f) =>
      f.endsWith(".js")
      )) {
        let command = require(`${folderPath}/${folder}/${file}`);
        if (command) {
          quranSlashCommands.push(command.data.toJSON());
          client26.quranSlashCommands.set(command.data.name, command);
          if (command.data.name) {
            table.addRow(`/${command.data.name}`, "🟢 Working");
          } else {
            table.addRow(`/${command.data.name}`, "🔴 Not Working");
          }
        }
  }
}

const folderPath3 = path.resolve(__dirname, '../../Bots/quran/handlers');
for (let file of readdirSync(folderPath3).filter(f => f.endsWith('.js'))) {
    const event = require(path.join(folderPath3, file))(client26);
}
            client26.on("ready" , async() => {

                try {
                  await rest.put(
                    Routes.applicationCommands(client26.user.id),
                    { body: quranSlashCommands },
                    );
                    
                  } catch (error) {
                    console.error(error)
                  }
          
              });
              const folderPath2 = path.resolve(__dirname, '../../Bots/quran/events');

            for (let file of readdirSync(folderPath2).filter(f => f.endsWith('.js'))) {
                const event = require(path.join(folderPath2, file));
            }
                client26.on("interactionCreate" , async(interaction) => {
                    if (interaction.isChatInputCommand()) {
                        if(interaction.user.bot) return;
                      
                      const command = client26.quranSlashCommands.get(interaction.commandName);
                        
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
                  client26.on("interactionCreate" , async(interaction) => {
                    if(interaction.isButton()) {
                      if(interaction.customId == "end_play") {
                        const voiceChannel = interaction.member.voice.channel;
                        if (!voiceChannel) {
                          return interaction.reply({content:`**يجب ان تدخل قناة صوتية اولا**`});
                        }
                        const connection = await joinVoiceChannel({
                          channelId: voiceChannel.id,
                          guildId: voiceChannel.guild.id,
                          adapterCreator: voiceChannel.guild.voiceAdapterCreator,
                        });
                        await connection.destroy()
                       let msg =  await interaction.reply({content:`**تم الخروج من القناة الصوتية بنجاح**`})
                        await interaction.message.delete()
                        setTimeout(() => {
                          msg.delete();
                        }, 3000);
                        
                      }
                    }
                    if(interaction.isStringSelectMenu()) {
                      const voiceChannel = interaction.member.voice.channel;
                      if (!voiceChannel) {
                        return interaction.reply({content:`**يجب ان تدخل قناة صوتية اولا**`});
                      }
                      let buttonId = interaction.values[0]
                      if(buttonId == "reset_select") {
                        return interaction.update().catch(async() => {return;})
                      }
                      let sounds = [
                        {
                          name: 'الشيخ مشاري راشد العفاسي',
                            url: 'https://www.youtube.com/watch?v=3ODvj9e4ktI&t=1s'
                        },
                        {
                          name: 'الشيخ سعد الغامدي',
                            url: 'https://www.youtube.com/watch?v=mlTEaDewo8g&t=26521s'
                        },
                        {
                          name: 'الشيخ ماهر المعيقلي',
                            url: 'https://www.youtube.com/watch?v=mQ70kbDmsKA&t=2s'
                        },
                        {
                          name: 'الشيخ ياسر الدوسري',
                            url: 'https://www.youtube.com/watch?v=VHVZaSxjV-Q&t=8s'
                        },
                        {
                          name: 'الشيخ عبد الباسط عبد الصمد',
                            url: 'https://www.youtube.com/watch?v=qc-SNASZWz4&t=11s'
                        },
                        {
                          name: 'الشيخ فارس عباد',
                            url: 'https://www.youtube.com/watch?v=y8b6LcpAICU'
                        },
                        {
                          name: 'الشيخ محمد صديق المنشاوي رحمه الله',
                            url: 'https://www.youtube.com/watch?v=L_DZWipt5hw&t=30099s'
                        },
                        {
                          name: 'الشيخ ناصر القطامي',
                            url: 'https://www.youtube.com/watch?v=_uVYDpin8fs'
                        },
                        {
                          name: 'الشيخ محمود خليل الحصري',
                            url: 'https://www.youtube.com/watch?v=LkGMu3RVcfg'
                        },
                        {
                          name: 'الشيخ علي الحذيفي',
                            url: 'https://www.youtube.com/watch?v=vVrE_B17X0g'
                        },
                        {
                          name: 'الشيخ محمد محمود الطبلاوي',
                          url: 'https://www.youtube.com/watch?v=CCZnDjPMRsk'
                        }
                    ];
                      let findShei5 = await sounds.find(sound => sound.url == buttonId)
                      const stream = ytdl(findShei5.url, { filter: 'audioonly' });
                      const connection = await joinVoiceChannel({
                        channelId: voiceChannel.id,
                        guildId: voiceChannel.guild.id,
                        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
                      });
                      const player = await createAudioPlayer({
                        behaviors: {
                          noSubscriber: NoSubscriberBehavior.Pause,
                        },
                      });
                      const resource = await createAudioResource(stream);
                      await connection.subscribe(player);
                      await player.play(resource);
                      const button1 = new ButtonBuilder()
                      .setEmoji(`❌`)
                      .setStyle(ButtonStyle.Danger)
                      .setCustomId(`end_play`)
                      const row = new ActionRowBuilder().addComponents(button1)
                      let embed1 = new EmbedBuilder()
                      .setTitle(`**تم التشغيل بنجاح بصوت الشيخ : \`${findShei5.name}\`**`)
                      .setTimestamp()
                      .setColor(`DarkGreen`)
                      return interaction.reply({embeds:[embed1] , components:[row]})
                    }
                  })
                  await client26.login(Bot_token).catch(async() => {
                    return interaction.editReply({content:`**فشل التحقق , الرجاء تفعيل اخر ثلاث خيارات في قائمة البوت**`})
                  })
                  if(!quran) {
                      await tokens.set(`quran` , [{token:Bot_token,prefix:Bot_prefix,clientId:client26.user.id,owner:interaction.user.id,timeleft:2629744}])


                  }else {
                      await tokens.push(`quran` , {token:Bot_token,prefix:Bot_prefix,clientId:client26.user.id,owner:interaction.user.id,timeleft:2629744})

                  }
        
            
            }catch(error){
                console.error(error)
                return interaction.editReply({content:`**قم بتفعيل الخيارات الثلاثة او التاكد من توكن البوت ثم اعد المحاولة**`})
            }
        }
    }
  }
}