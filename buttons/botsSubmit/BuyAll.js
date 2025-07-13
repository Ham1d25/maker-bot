const { Client, AuditLogEvent,Collection, discord,GatewayIntentBits, Partials , EmbedBuilder, ApplicationCommandOptionType , Events , ActionRowBuilder , ButtonBuilder ,MessageAttachment, ButtonStyle , Message } = require("discord.js");
const { Database } = require("st.db")
const setting = new Database("/database/settingsdata/setting");
const usersdata = new Database(`/database/usersdata/usersdata`);
const prices = new Database("/database/settingsdata/prices");
const invoices = new Database("/database/settingsdata/invoices");
const tokens = new Database("/tokens/tokens")
const tier1subscriptions = new Database("/database/makers/tier1/subscriptions")
const allDB = new Database("/Json-db/Bots/allDB.json")
const fs = require('fs');

let all = tokens.get(`all`)
const path = require('path');
const { readdirSync } = require("fs");
;module.exports = {
  name: Events.InteractionCreate,
  /**
   * @param {Interaction} interaction
  */
  async execute(interaction){
    if (interaction.isModalSubmit()) {
        if(interaction.customId == "Buyall_Modal") {
            await interaction.deferReply({ephemeral:true})
          const Bot_token = interaction.fields.getTextInputValue(`Bot_token`)
          const Bot_prefix = interaction.fields.getTextInputValue(`Bot_prefix`)
            let userbalance = parseInt(usersdata.get(`balance_${interaction.user.id}_${interaction.guild.id}`))
            
    const client33 = new Client({intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.MessageContent], shards: "auto", partials: [Partials.Message, Partials.Channel, Partials.GuildMember,]});
            try{
                const owner = interaction.user.id
                let price1 = prices.get(`all_price_${interaction.guild.id}`) || 20;
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
               client33.on("ready" , async() => {
                let doneembeduser = new EmbedBuilder()
                .setTitle(`**تم انشاء بوتك بنجاح**`)
                .setDescription(`**معلومات الفاتورة :**`)
                .addFields(
                  {
                          name:`**الفاتورة**`,value:`**\`${invoice}\`**`,inline:false
                      },
                      {
                          name:`**نوع البوت**`,value:`**\`ALL\`**`,inline:false
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
                          type:`ALL`,
                          token:`${Bot_token}`,
                          prefix:`${Bot_prefix}`,
                          userid:`${interaction.user.id}`,
                          guildid:`${interaction.guild.id}`,
                          serverid:`عام`,
                      price:price1
                  })
                const newbalance = parseInt(userbalance) - parseInt(price1)
await usersdata.set(`balance_${interaction.user.id}_${interaction.guild.id}` , newbalance)
                const thebut = new ButtonBuilder().setLabel(`دعوة البوت`).setStyle(ButtonStyle.Link).setURL(`https://discord.com/api/oauth2/authorize?client_id=${client33.user.id}&permissions=8&scope=bot%20applications.commands`);const rowss = new ActionRowBuilder().addComponents(thebut);
                await interaction.user.send({embeds:[doneembeduser] , components:[rowss]})
            })
                let doneembedprove = new EmbedBuilder()
                .setColor(`Gold`)
                .setDescription(`**تم شراء بوت \`الكل في واحد\` بواسطة : ${interaction.user}**`)
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
                client33.commands = new Collection();
                client33.events = new Collection();
                require("../../Bots/all/handlers/events")(client33)
                require("../../events/requireBots/all-commands")(client33);
                const folderPath = path.resolve(__dirname, '../../Bots/all/slashcommand33');
                const prefix = Bot_prefix
                client33.allSlashCommands = new Collection();
  const allSlashCommands = [];
  const ascii = require("ascii-table");
  const table = new ascii("all commands").setJustify();
  for (let folder of readdirSync(folderPath).filter(
      (folder) => !folder.includes(".")
      )) {
      for (let file of readdirSync(`${folderPath}/` + folder).filter((f) =>
      f.endsWith(".js")
      )) {
          let command = require(`${folderPath}/${folder}/${file}`);
          if (command) {
              allSlashCommands.push(command.data.toJSON());
              client33.allSlashCommands.set(command.data.name, command);
              if (command.data.name) {
                  table.addRow(`/${command.data.name}`, "🟢 Working");
                } else {
            table.addRow(`/${command.data.name}`, "🔴 Not Working");
          }
        }
    }
}


const folderPath3 = path.resolve(__dirname, '../../Bots/all/handlers');
for (let file of readdirSync(folderPath3).filter(f => f.endsWith('.js'))) {
    const event = require(path.join(folderPath3, file))(client33);
}
client33.on('ready' , async() => {
    setInterval(async() => {
      let BroadcastTokenss = tokens.get(`all`)
      let thiss = BroadcastTokenss.find(br => br.token == Bot_token)
      if(thiss) {
        if(thiss.timeleft <= 0) {
            console.log(`${client33.user.id} Ended`)
          await client33.destroy();
        }
      }
    }, 1000);
  })
client33.on("ready" , async() => {
    
    try {
        await rest.put(
            Routes.applicationCommands(client33.user.id),
            { body: allSlashCommands },
            );
            
        } catch (error) {
            console.error(error)
        }
        
    });
    const folderPath2 = path.resolve(__dirname, '../../Bots/all/events');
    
    for (let file of readdirSync(folderPath2).filter(f => f.endsWith('.js'))) {
        const event = require(path.join(folderPath2, file));
    }
 
 
    client33.on("messageCreate" , async(message) => {
      if(message.author.bot) return;
      try {
        if(message.content == "-" || message.content == "خط") {
          const line = allDB.get(`line_${message.guild.id}`)
          if(line) {
            await message.delete()
            return message.channel.send({content:`${line}`});
          }
        }
      } catch (error) {
        return;
      }
     
    })
    
    client33.on("messageCreate" , async(message) => {
      if(message.author.bot) return;
      const autoChannels = allDB.get(`line_channels_${message.guild.id}`)
        if(autoChannels) {
          if(autoChannels.length > 0) {
            if(autoChannels.includes(message.channel.id)) {
              const line = allDB.get(`line_${message.guild.id}`)
          if(line) {
            return message.channel.send({content:`${line}`});
            }
          }
          }
        }
    })
 
    const messages = [
      "(رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ).",
      "(رَبَّنَا لَا تُؤَاخِذْنَا إِن نَّسِينَا أَوْ أَخْطَأْنَا ۚ رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَا إِصْرًا كَمَا حَمَلْتَهُ عَلَى الَّذِينَ مِن قَبْلِنَا ۚ رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِ ۖ وَاعْفُ عَنَّا وَاغْفِرْ لَنَا وَارْحَمْنَا).",
      "(رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً).",
      "(رَبِّ هَبْ لِي مِن لَّدُنكَ ذُرِّيَّةً طَيِّبَةً ۖ إِنَّكَ سَمِيعُ الدُّعَاءِ).",
      "(رَبَّنَا اغْفِرْ لَنَا ذُنُوبَنَا وَإِسْرَافَنَا فِي أَمْرِنَا وَثَبِّتْ أَقْدَامَنَا وَانصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ).",
      "(رَبَّنَا آتِنَا مِن لَّدُنكَ رَحْمَةً وَهَيِّئْ لَنَا مِنْ أَمْرِنَا رَشَدًا).",
      "(رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِن ذُرِّيَّتِي ۚ رَبَّنَا وَتَقَبَّلْ دُعَاءِ).",
      "(قَالَ رَبِّ اشْرَحْ لِي صَدْرِي*وَيَسِّرْ لِي أَمْرِي).",
      "(رَّبِّ زِدْنِي عِلْمًا).",
      "(رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا).",
      "(يا مُقلِّبَ القلوبِ ثبِّت قلبي على دينِكَ).",
      "(اللَّهمَّ آتِنا في الدُّنيا حَسنةً وفي الآخرةِ حَسنةً وقِنا عذابَ النَّارِ).",
      "(يا مُقلِّبَ القلوبِ ثبِّت قلبي على دينِكَ).",
      "بسم الله الرحمن الرحيم ﴿قُلْ هُوَ اللَّهُ أَحَدٌ* اللَّهُ الصَّمَدُ* لَمْ يَلِدْ وَلَمْ يُولَدْ* وَلَمْ يَكُن لَّهُ كُفُواً أَحَدٌ﴾. بسم الله الرحمن الرحيم ﴿قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ* مِن شَرِّ مَا خَلَقَ* وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ* وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ* وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ﴾. بسم الله الرحمن الرحيم ﴿قُلْ أَعُوذُ بِرَبِّ النَّاسِ* مَلِكِ النَّاسِ* إِلَهِ النَّاسِ* مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ* الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ* مِنَ الْجِنَّةِ وَ النَّاسِ﴾ (ثلاثَ مرَّاتٍ).",
      "((أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَهَ إلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذَا الْيَوْمِ وَخَيرَ مَا بَعْدَهُ ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ)).",
      "((اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا ، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ)). [وإذا أمسى قال: اللَّهم بك أمسينا، وبك أصبحنا، وبك نحيا، وبك نموت، وإليك المصير.]",
      "((اللَّهُمَّ إِنِّي أَصْبَحْتُ أُشْهِدُكَ، وَأُشْهِدُ حَمَلَةَ عَرْشِكَ، وَمَلاَئِكَتِكَ، وَجَمِيعَ خَلْقِكَ، أَنَّكَ أَنْتَ اللَّهُ لَا إِلَهَ إِلاَّ أَنْتَ وَحْدَكَ لاَ شَرِيكَ لَكَ، وَأَنَّ مُحَمَّداً عَبْدُكَ وَرَسُولُكَ))",
      "((اللَّهُمَّ عَالِمَ الغَيْبِ وَالشَّهَادَةِ فَاطِرَ السَّمَوَاتِ وَالْأَرْضِ، رَبَّ كُلِّ شَيْءٍ وَمَلِيكَهُ، أَشْهَدُ أَنْ لاَ إِلَهَ إِلاَّ أَنْتَ، أَعُوذُ بِكَ مِنْ شَرِّ نَفْسِي، وَمِنْ شَرِّ الشَّيْطانِ وَشَرَكِهِ، وَأَنْ أَقْتَرِفَ عَلَى نَفْسِي سُوءاً، أَوْ أَجُرَّهُ إِلَى مُسْلِمٍ)).",
      "((بِسْمِ اللَّهِ الَّذِي لاَ يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلاَ فِي السّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ)) (ثلاثَ مرَّاتٍ).",
      "((رَضِيتُ بِاللَّهِ رَبَّاً، وَبِالْإِسْلاَمِ دِيناً، وَبِمُحَمَّدٍ صلى الله عليه وسلم نَبِيّاً)) (ثلاثَ مرَّاتٍ).",
      "((أَصْبَحْنا عَلَى فِطْرَةِ الْإِسْلاَمِ، وَعَلَى كَلِمَةِ الْإِخْلاَصِ، وَعَلَى دِينِ نَبِيِّنَا مُحَمَّدٍ صلى الله عليه وسلم، وَعَلَى مِلَّةِ أَبِينَا إِبْرَاهِيمَ، حَنِيفاً مُسْلِماً وَمَا كَانَ مِنَ الْمُشرِكِينَ)).",
      "((سُبْحَانَ اللَّهِ وَبِحَمْدِهِ)) (مائة مرَّةٍ).",
      "((سُبْحَانَ اللَّهِ وَبِحَمْدِهِ: عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ)) (ثلاثَ مرَّاتٍ إذا أصبحَ).",
      "((اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْماً نَافِعاً، وَرِزْقاً طَيِّباً، وَعَمَلاً مُتَقَبَّلاً)) (إذا أصبحَ).",
      "((أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ)) (مِائَةَ مَرَّةٍ فِي الْيَوْمِ).",
      "((أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ)) (ثلاثَ مرَّاتٍ إذا أمسى).",
      "((اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبَيِّنَا مُحَمَّدٍ)) (عشرَ مرَّاتٍ)."
  ];
  
  
  client33.on("ready", async () => {
      // تحديث قاعدة البيانات كل ثانية
      setInterval(async () => {
          // قراءة القيمة الحالية لـ channelIds
          const channelIds = allDB.get("channelIds");
  
          // التحقق مما إذا كانت channelIds مصفوفة
          if (Array.isArray(channelIds)) {
              // تحديث قاعدة البيانات أو عمل أي عمليات أخرى اللازمة
              // ...
  
              
          } else {
              console.error("قيمة channelIds غير معرفة أو غير صالحة");
          }
      }, 100); // تحديث قاعدة البيانات كل ثانية
  
      // إرسال الرسائل إلى الرومات المحددة كل دقيقتين
      setInterval(async () => {
          // قراءة القيمة الحالية لـ channelIds
          const channelIds = allDB.get("channelIds");
  
          // التحقق مما إذا كانت channelIds مصفوفة
          if (Array.isArray(channelIds) && channelIds.length > 0) {
              // إرسال الرسائل إلى الرومات المحددة
              channelIds.forEach(async (channelId) => {
                  const channel = await client33.channels.fetch(channelId);
                  if (channel) {
                      const randomIndex = Math.floor(Math.random() * messages.length);
                      const randomMessage = messages[randomIndex];
                      channel.send(randomMessage);
                  }
              });
          } else {
              console.log("no rooms.");
          }
      }, 120000); // إرسال الرسائل كل دقيقتين (120000 مللي ثانية)
  });
 
 
  client33.on('guildMemberAdd' , async(member) => {
    const dataFind = allDB.get(`blacklisted_${member.guild.id}`)
    if(dataFind) {
      if(!dataFind.includes(member.user.id)) return;
      const roleFind = allDB.get(`blacklist_role_${member.guild.id}`)
      if(roleFind) {
        try {
          member.roles.add(roleFind)
        } catch {
          return;
        }
      }
    }
  })
  client33.on("guildMemberAdd" , async(member) => {
    const guild = member.guild;
    let dataFind = allDB.get(`blacklisted_${guild.id}`)
    if(!dataFind) {
      await allDB.set(`blacklisted_${guild.id}` , [])
    }
    dataFind = allDB.get(`blacklisted_${guild.id}`)
    const roleFind = allDB.get(`blacklist_role_${guild.id}`)
    if(!roleFind) {
      return;
    }
    if(dataFind.includes(member.user.id)) {
      await member.roles.add(roleFind)
    }
  } )
  
  client33.on('guildMemberUpdate', async (oldMember, newMember) => {
    const guild = oldMember.guild;
    const removedRoles = oldMember.roles.cache.filter((role) => !newMember.roles.cache.has(role.id));
    if (removedRoles.size > 0 && allDB.get(`blacklist_role_${guild.id}`)) {
      let roleRemoveLog1 = allDB.get(`blacklist_role_${guild.id}`)
      
      const fetchedLogs = await guild.fetchAuditLogs({
        limit: removedRoles.size,
        type: AuditLogEvent.MemberRoleUpdate
      });
      
      removedRoles.forEach(async(role) => {
        let dataFind = allDB.get(`blacklisted_${guild.id}`)
        if(!dataFind) {
          await allDB.set(`blacklisted_${guild.id}` , [])
        }
        dataFind = allDB.get(`blacklisted_${guild.id}`)
        const roleFind = allDB.get(`blacklist_role_${guild.id}`)
        if(!roleFind) {
          return;
        }
        if(dataFind.includes(newMember.user.id)) {
          await newMember.roles.add(roleFind)
        }
      });
    }
  });

   client33.on("messageCreate" , async(message) => {
    if(message.author.bot) return;
  const line = allDB.get(`line_${message.guild.id}`)
  const chan = allDB.get(`feedback_room_${message.guild.id}`)
  if(line && chan) {
      if(chan != message.channel.id) return;
    const embed = new EmbedBuilder()
    .setTimestamp()
    .setTitle(`**${message.content}**`)
    .setAuthor({name:message.author.username , iconURL:message.author.displayAvatarURL({dynamic:true})})
    await message.delete()
    const themsg = await message.channel.send({embeds:[embed]})
    await themsg.react("❤")
       await message.channel.send({content:`${line}`})

  }
})

  client33.on("ready" , async() => {
    let theguild = client33.guilds.cache.first();
    setInterval(() => {
      let giveaways = allDB.get(`giveaways_${theguild.id}`)
      if(!giveaways) return;
      giveaways.forEach(async(giveaway) => {
        let {messageid , channelid , entries , winners , prize , duration,dir1,dir2,ended} = giveaway;
        if(duration > 0) {
          duration = duration - 1
          giveaway.duration = duration;
          await allDB.set(`giveaways_${theguild.id}` , giveaways)
        }else if(duration == 0) {
          duration = duration - 1
          giveaway.duration = duration;
          await allDB.set(`giveaways_${theguild.id}` , giveaways)
          const theroom = theguild.channels.cache.find(ch => ch.id == channelid)
          const themsg = await theroom.messages.cache.find(msg => msg.id == messageid)
          if(entries.length > 0 && entries.length >= winners) {
            const theWinners = [];
            for(let i = 0; i < winners; i++) {
              let winner = Math.floor(Math.random() * entries.length);
              let winnerExcept = entries.splice(winner, 1)[0];
              theWinners.push(winnerExcept);
            }
            const button = new ButtonBuilder()
  .setEmoji(`🎉`)
  .setStyle(ButtonStyle.Primary)
  .setCustomId(`join_giveaway`)
  .setDisabled(true)
  const row = new ActionRowBuilder().addComponents(button)
            themsg.edit({components:[row]})
            themsg.reply({content:`Congratulations ${theWinners}! You won the **${prize}**!`})
            giveaway.ended = true;
            await allDB.set(`giveaways_${theguild.id}` , giveaways)
          }else{
            const button = new ButtonBuilder()
  .setEmoji(`🎉`)
  .setStyle(ButtonStyle.Primary)
  .setCustomId(`join_giveaway`)
  .setDisabled(true)
  const row = new ActionRowBuilder().addComponents(button)
            themsg.edit({components:[row]})
            themsg.reply({content:`**لا يوجد عدد من المشتركين كافي**`})
            giveaway.ended = true;
            await allDB.set(`giveaways_${theguild.id}` , giveaways)
          }
        }
      })
    }, 1000);
  
  })

  client33.on('messageDelete' , async(message) => {
    if(message.author.bot) return;
  if (!allDB.has(`log_messagedelete_${message.guild.id}`)) return;
  let deletelog1 = allDB.get(`log_messagedelete_${message.guild.id}`)
    let deletelog2 = message.guild.channels.cache.get(deletelog1)
    const fetchedLogs = await message.guild.fetchAuditLogs({
      limit: 1,
      type: AuditLogEvent.MessageDelete
    });
    const deletionLog = fetchedLogs.entries.first();
    const { executor, target } = deletionLog;
  let deleteembed = new EmbedBuilder()
  .setTitle(`**تم حذف رسالة**`)
      .addFields(
        {
          name: `**صاحب الرسالة : **`, value: `**\`\`\`${message.author.tag} - (${message.author.id})\`\`\`**`, inline: false
        },
        {
          name: `**حاذف الرسالة : **`, value: `**\`\`\`${executor.username} - (${executor.id})\`\`\`**`, inline: false
        },
        {
          name: `**محتوى الرسالة : **`, value: `**\`\`\`${message.content}\`\`\`**`, inline: false
        },
        {
          name: `**الروم الذي تم الحذف فيه : **`, value: `${message.channel}`, inline: false
        }
      )
      .setTimestamp();
    await deletelog2.send({ embeds: [deleteembed] })
})
client33.on('messageUpdate' , async(oldMessage, newMessage) => {
if (!allDB.has(`log_messageupdate_${oldMessage.guild.id}`)) return;
const fetchedLogs = await oldMessage.guild.fetchAuditLogs({
  limit: 1,
  type: AuditLogEvent.MessageUpdate
});
let updateLog1 = allDB.get(`log_messageupdate_${oldMessage.guild.id}`);
    let updateLog2 = oldMessage.guild.channels.cache.get(updateLog1); 
const updateLog = fetchedLogs.entries.first();
const { executor } = updateLog;
let updateEmbed = new EmbedBuilder()
.setTitle(`**تم تعديل رسالة**`)
.addFields(
  {
    name: "**صاحب الرسالة:**",
    value: `**\`\`\`${oldMessage.author.tag} (${oldMessage.author.id})\`\`\`**`,
    inline: false
  },
  {
    name: "**المحتوى القديم:**",
    value: `**\`\`\`${oldMessage.content}\`\`\`**`,
    inline: false
  },
  {
    name: "**المحتوى الجديد:**",
    value: `**\`\`\`${newMessage.content}\`\`\`**`,
    inline: false
  },
  {
    name: "**الروم الذي تم التحديث فيه:**",
    value: `${oldMessage.channel}`,
    inline: false
  }
)
.setTimestamp()
await updateLog2.send({ embeds: [updateEmbed] });
})
client33.on('roleCreate' , async(role) => {
if (!allDB.has(`log_rolecreate_${role.guild.id}`)) return;
let roleCreateLog1 = allDB.get(`log_rolecreate_${role.guild.id}`);
    let roleCreateLog2 = role.guild.channels.cache.get(roleCreateLog1);
    const fetchedLogs = await role.guild.fetchAuditLogs({
      limit: 1,
      type: AuditLogEvent.RoleCreate
    });
    const roleCreateLog = fetchedLogs.entries.first();
    const { executor } = roleCreateLog;
    let roleCreateEmbed = new EmbedBuilder()
      .setTitle('**تم انشاء رتبة**')
      .addFields(
        { name: 'اسم الرتبة :', value: `\`\`\`${role.name}\`\`\``, inline: true },
        { name: 'الذي قام بانشاء الرتبة :', value: `\`\`\`${executor.username} (${executor.id})\`\`\``, inline: true }
      )
      .setTimestamp();
    await roleCreateLog2.send({ embeds: [roleCreateEmbed] });
})
client33.on('roleDelete' , async(role) => {
if (!allDB.has(`log_roledelete_${role.guild.id}`)) return;
let roleDeleteLog1 = allDB.get(`log_roledelete_${role.guild.id}`);
    let roleDeleteLog2 = role.guild.channels.cache.get(roleDeleteLog1);
    const fetchedLogs = await role.guild.fetchAuditLogs({
      limit: 1,
      type: AuditLogEvent.RoleDelete
    });

    const roleDeleteLog = fetchedLogs.entries.first();
    const { executor } = roleDeleteLog;

    let roleDeleteEmbed = new EmbedBuilder()
      .setTitle('**تم حذف رتبة**')
      .addFields({name:'اسم الرتبة :', value:`\`\`\`${role.name}\`\`\``, inline:true},{name:'الذي قام بحذف الرتبة :', value:`\`\`\`${executor.username} (${executor.id})\`\`\``, inline:true})
      .setTimestamp();

    await roleDeleteLog2.send({ embeds: [roleDeleteEmbed] });
})




client33.on('channelCreate', async (channel) => {
if (allDB.has(`log_channelcreate_${channel.guild.id}`)) {
  let channelCreateLog1 = allDB.get(`log_channelcreate_${channel.guild.id}`);
  let channelCreateLog2 = channel.guild.channels.cache.get(channelCreateLog1);




  const fetchedLogs = await channel.guild.fetchAuditLogs({
    limit: 1,
    type: AuditLogEvent.ChannelCreate
  });

  const channelCreateLog = fetchedLogs.entries.first();
  const { executor } = channelCreateLog;

  let channelCategory = channel.parent ? channel.parent.name : 'None';

  let channelCreateEmbed = new EmbedBuilder()
    .setTitle('**تم انشاء روم**')
    .addFields(
      { name: 'اسم الروم : ', value: `\`\`\`${channel.name}\`\`\``, inline: true },
      { name: 'كاتيجوري الروم : ', value: `\`\`\`${channelCategory}\`\`\``, inline: true },
      { name: 'الذي قام بانشاء الروم : ', value: `\`\`\`${executor.username} (${executor.id})\`\`\``, inline: true }
    )
    .setTimestamp();

  await channelCreateLog2.send({ embeds: [channelCreateEmbed] });
}
});




client33.on('channelDelete', async (channel) => {
if (allDB.has(`log_channeldelete_${channel.guild.id}`)) {
  let channelDeleteLog1 = allDB.get(`log_channeldelete_${channel.guild.id}`);
  let channelDeleteLog2 = channel.guild.channels.cache.get(channelDeleteLog1);




  const fetchedLogs = await channel.guild.fetchAuditLogs({
    limit: 1,
    type: AuditLogEvent.ChannelDelete
  });

  const channelDeleteLog = fetchedLogs.entries.first();
  const { executor } = channelDeleteLog;

  let channelDeleteEmbed = new EmbedBuilder()
    .setTitle('**تم حذف روم**')
    .addFields(
      { name: 'اسم الروم : ', value: `\`\`\`${channel.name}\`\`\``, inline: true },
      { name: 'الذي قام بحذف الروم : ', value: `\`\`\`${executor.username} (${executor.id})\`\`\``, inline: true }
    )
    .setTimestamp();

  await channelDeleteLog2.send({ embeds: [channelDeleteEmbed] });
}
});

client33.on('guildMemberUpdate', async (oldMember, newMember) => {
const guild = oldMember.guild;
const addedRoles = newMember.roles.cache.filter((role) => !oldMember.roles.cache.has(role.id));
const removedRoles = oldMember.roles.cache.filter((role) => !newMember.roles.cache.has(role.id));




if (addedRoles.size > 0 && allDB.has(`log_rolegive_${guild.id}`)) {
  let roleGiveLog1 = allDB.get(`log_rolegive_${guild.id}`);
  let roleGiveLog2 = guild.channels.cache.get(roleGiveLog1);

  const fetchedLogs = await guild.fetchAuditLogs({
    limit: addedRoles.size,
    type: AuditLogEvent.MemberRoleUpdate
  });

  addedRoles.forEach((role) => {
    const roleGiveLog = fetchedLogs.entries.find((log) => log.target.id === newMember.id && log.changes[0].new[0].id === role.id);
    const roleGiver = roleGiveLog ? roleGiveLog.executor : null;
    const roleGiverUsername = roleGiver ? `${roleGiver.username} (${roleGiver.id})` : `UNKNOWN`;



    let roleGiveEmbed = new EmbedBuilder()
      .setTitle('**تم إعطاء رتبة لعضو**')
      .addFields(
        { name: 'اسم الرتبة:', value: `\`\`\`${role.name}\`\`\``, inline: true },
        { name: 'تم إعطاءها بواسطة:', value: `\`\`\`${roleGiverUsername}\`\`\``, inline: true },
        { name: 'تم إعطائها للعضو:', value: `\`\`\`${newMember.user.username} (${newMember.user.id})\`\`\``, inline: true }
      )
      .setTimestamp();

    roleGiveLog2.send({ embeds: [roleGiveEmbed] });
  });
}

if (removedRoles.size > 0 && allDB.has(`log_roleremove_${guild.id}`)) {
  let roleRemoveLog1 = allDB.get(`log_roleremove_${guild.id}`);
  let roleRemoveLog2 = guild.channels.cache.get(roleRemoveLog1);

  const fetchedLogs = await guild.fetchAuditLogs({
    limit: removedRoles.size,
    type: AuditLogEvent.MemberRoleUpdate
  });




  removedRoles.forEach((role) => {
    const roleRemoveLog = fetchedLogs.entries.find((log) => log.target.id === newMember.id && log.changes[0].new[0].id === role.id);
    const roleRemover = roleRemoveLog ? roleRemoveLog.executor : null;
    const roleRemoverUsername = roleRemover ? `${roleRemover.username} (${roleRemover.id})` : `UNKNOWN`;

    let roleRemoveEmbed = new EmbedBuilder()
      .setTitle('**تم إزالة رتبة من عضو**')
      .addFields(
        { name: 'اسم الرتبة:', value: `\`\`\`${role.name}\`\`\``, inline: true },
        { name: 'تم إزالتها بواسطة:', value: `\`\`\`${roleRemoverUsername}\`\`\``, inline: true },
        { name: 'تم إزالتها من العضو:', value: `\`\`\`${newMember.user.username} (${newMember.user.id})\`\`\``, inline: true }
      )
      .setTimestamp();


    roleRemoveLog2.send({ embeds: [roleRemoveEmbed] });
  });
}
});
client33.on('guildMemberAdd', async (member) => {
const guild = member.guild;
if(!member.bot) return;
const fetchedLogs = await guild.fetchAuditLogs({
  limit: 1,
  type: AuditLogEvent.BotAdd
});




const botAddLog = fetchedLogs.entries.first();
const { executor, target } = botAddLog;

if (target.bot) {
  let botAddLog1 = allDB.get(`log_botadd_${guild.id}`);
  let botAddLog2 = guild.channels.cache.get(botAddLog1);

  let botAddEmbed = new EmbedBuilder()
    .setTitle('**تم اضافة بوت جديد الى السيرفر**')
    .addFields(
      { name: 'اسم البوت :', value: `\`\`\`${member.user.username}\`\`\``, inline: true },
      { name: 'ايدي البوت :', value: `\`\`\`${member.user.id}\`\`\``, inline: true },
      { name: 'هل لدية صلاحية الادمن ستريتور ؟ :', value: member.permissions.has('ADMINISTRATOR') ? `\`\`\`نعم لديه\`\`\`` : `\`\`\`لا ليس لديه\`\`\``, inline: true },
      { name: 'تم اضافته بواسطة :', value: `\`\`\`${executor.username} (${executor.id})\`\`\``, inline: false }
    )
    .setTimestamp();

  botAddLog2.send({ embeds: [botAddEmbed] });
}
});





client33.on('guildBanAdd', async (guild, user) => {
if (allDB.has(`log_banadd_${guild.id}`)) {
  let banAddLog1 = allDB.get(`log_banadd_${guild.id}`);
  let banAddLog2 = guild.channels.cache.get(banAddLog1);

  const fetchedLogs = await guild.fetchAuditLogs({
    limit: 1,
    type: AuditLogEvent.MemberBanAdd
  });

  const banAddLog = fetchedLogs.entries.first();
  const banner = banAddLog ? banAddLog.executor : null;
  const bannerUsername = banner ? `\`\`\`${banner.username} (${banner.id})\`\`\`` : `\`\`\`UNKNOWN\`\`\``;


  let banAddEmbed = new EmbedBuilder()
    .setTitle('**تم حظر عضو**')
    .addFields(
      { name: 'العضو المحظور:', value: `\`\`\`${user.tag} (${user.id})\`\`\`` },
      { name: 'تم حظره بواسطة:', value: bannerUsername },
    )
    .setTimestamp();

  banAddLog2.send({ embeds: [banAddEmbed] });
}
});

client33.on("guildMemberAdd" , async(member) => {
  const theeGuild = member.guild
  let rooms = allDB.get(`rooms_${theeGuild.id}`)
  const message = allDB.get(`message_${theeGuild.id}`)
  if(!rooms) return;
  if(rooms.length <= 0) return;
  if(!message) return;
  await rooms.forEach(async(room) => {
    const theRoom = await theeGuild.channels.cache.find(ch => ch.id == room)
    if(!theRoom) return;
    await theRoom.send({content:`${member} , ${message}`}).then(async(msg) => {
      setTimeout(() => {
        msg.delete();
      }, 1500);
    })
  })
})

client33.on('interactionCreate', async interaction => {
  if (!interaction.isButton()) return;

  if (interaction.customId === 'role1') { // التحقق من ايدي الزر
      const member = interaction.member;


      try {
          const roleId = await allDB.get(`role1_${interaction.guildId}`); // تغيير الاسم من creditDB إلى allDB
          if (!roleId) {
              return console.error('**لم يتم تعيين الرولات لهذا السيرفر بعد**');
          }

          const role = interaction.guild.roles.cache.get(roleId);

          if (!role) {
              return console.error('**الرول غير موجود**');
          }

          await member.roles.add(role);
          await interaction.reply({ content: '**تم إعطاؤك الرول بنجاح!**', ephemeral: true });
      } catch (error) {
          console.error('فشل في إضافة الدور:', error);
          await interaction.reply({ content: '**يرجى التأكد ان رتبة البوت اعلى من الرتبة المحددة**', ephemeral: true });
      }
  }
});

client33.on('interactionCreate', async interaction => {
  if (!interaction.isButton()) return;

  if (interaction.customId === 'role2') { // التحقق من ايدي الزر
      const member = interaction.member;


      try {
          const roleId = await allDB.get(`role2_${interaction.guildId}`); // تغيير الاسم من creditDB إلى allDB
          if (!roleId) {
              return console.error('**لم يتم تعيين الرولات لهذا السيرفر بعد**');
          }

          const role = interaction.guild.roles.cache.get(roleId);

          if (!role) {
              return console.error('**الرول غير موجود**');
          }

          await member.roles.add(role);
          await interaction.reply({ content: '**تم إعطاؤك الرول بنجاح!**', ephemeral: true });
      } catch (error) {
          console.error('فشل في إضافة الدور:', error);
          await interaction.reply({ content: '**يرجى التأكد ان رتبة البوت اعلى من الرتبة المحددة**', ephemeral: true });
      }
  }
});

client33.on('interactionCreate', async interaction => {
  if (!interaction.isButton()) return;

  if (interaction.customId === 'role3') { // التحقق من ايدي الزر
      const member = interaction.member;


      try {
          const roleId = await allDB.get(`role3_${interaction.guildId}`); // تغيير الاسم من creditDB إلى allDB
          if (!roleId) {
              return console.error('**لم يتم تعيين الرولات لهذا السيرفر بعد**');
          }

          const role = interaction.guild.roles.cache.get(roleId);

          if (!role) {
              return console.error('**الرول غير موجود**');
          }

          await member.roles.add(role);
          await interaction.reply({ content: '**تم إعطاؤك الرول بنجاح!**', ephemeral: true });
      } catch (error) {
          console.error('فشل في إضافة الدور:', error);
          await interaction.reply({ content: '**يرجى التأكد ان رتبة البوت اعلى من الرتبة المحددة**', ephemeral: true });
      }
  }
});

client33.on('interactionCreate', async interaction => {
  if (!interaction.isButton()) return;

  if (interaction.customId === 'role4') { // التحقق من ايدي الزر
      const member = interaction.member;


      try {
          const roleId = await allDB.get(`role4_${interaction.guildId}`); // تغيير الاسم من creditDB إلى allDB
          if (!roleId) {
              return console.error('**لم يتم تعيين الرولات لهذا السيرفر بعد**');
          }

          const role = interaction.guild.roles.cache.get(roleId);

          if (!role) {
              return console.error('**الرول غير موجود**');
          }

          await member.roles.add(role);
          await interaction.reply({ content: '**تم إعطاؤك الرول بنجاح!**', ephemeral: true });
      } catch (error) {
          console.error('فشل في إضافة الدور:', error);
          await interaction.reply({ content: '**يرجى التأكد ان رتبة البوت اعلى من الرتبة المحددة**', ephemeral: true });
      }
  }
});

client33.on("messageCreate" , async(message) => {
  if(message.author.bot) return;
  const line = allDB.get(`line_${message.guild.id}`)
  const chan = allDB.get(`suggestions_room_${message.guild.id}`)
  let chans = allDB.get(`suggestions_room_${message.guild.id}`)
  if(line && chan) {
   if(chan != message.channel.id) return;
    const embed = new EmbedBuilder()
    .setTimestamp()
    .setTitle(`**${message.content}**`)
    .setAuthor({name:message.author.username , iconURL:message.author.displayAvatarURL({dynamic:true})})
    .setFooter({text:message.guild.name , iconURL:message.guild.iconURL({dynamic:true})})
    const button1 = new ButtonBuilder()
    .setCustomId(`ok_button`)
    .setLabel(`0`)
    .setEmoji("✅")
    .setStyle(ButtonStyle.Success)
    const button2 = new ButtonBuilder()
    .setCustomId(`no_button`)
    .setLabel(`0`)
    .setEmoji("❌")
    .setStyle(ButtonStyle.Danger)
    const row = new ActionRowBuilder().addComponents(button1 , button2)
    let send = await message.channel.send({embeds:[embed] , components:[row]}).catch(() => {return interaction.reply({content:`**الرجاء التأكد من صلاحياتي**`})})
    await message.channel.send({content:`${line}`})
    await allDB.set(`${send.id}_ok` , 0)
    await allDB.set(`${send.id}_no` , 0)
    return message.delete()

  }
})

client33.on('messageCreate' , async(message) => {
  if(message.author.bot) return;
  let roomid = allDB.get(`tax_room_${message.guild.id}`)
  if(roomid) {
    if(message.channel.id == roomid) {
      if(message.author.bot) return;
      let number = message.content
    if(number.endsWith("k")) number = number.replace(/k/gi, "") * 1000;
else if(number.endsWith("K")) number = number.replace(/K/gi, "") * 1000;
    else if(number.endsWith("m")) number = number.replace(/m/gi, "") * 1000000;
  else if(number.endsWith("M")) number = number.replace(/M/gi, "") * 1000000;
      let number2 = parseInt(number)
    let tax = Math.floor(number2 * (20) / (19) + 1) // المبلغ مع الضريبة
    let tax2 = Math.floor(tax - number2) // الضريبة
    let tax3 = Math.floor(tax * (20) / (19) + 1) // المبلغ مع ضريبة الوسيط
    let tax4 = Math.floor(tax3 - tax) // ضريبة الوسيط
let embed1 = new EmbedBuilder()
.setFooter({text:message.author.username , iconURL:message.author.displayAvatarURL({dynamic:true})})
    .setAuthor({name:message.guild.name , iconURL:message.guild.iconURL({dynamic:true})})
    .setTimestamp(Date.now())
    .setColor('#000000')
    .addFields([
        {
            name:`**المبلغ**` , value:`**\`${number2}\`**` , inline:true
        },
        {
            name:`**المبلغ مع الضريبة**` , value:`**\`${tax}\`**` , inline:true
        },
        {
            name:`**المبلغ مع ضريبة الوسيط**` , value:`**\`${tax3}\`**` , inline:false
        },
        {
            name:`**الضريبة**` , value:`**\`${tax2}\`**` , inline:true
        },
        {
            name:`**ضريبة الوسيط**` , value:`**\`${tax4}\`**` , inline:true
        }
    ])
    return message.reply({embeds:[embed1]})
    }
  }
})


    client33.on("interactionCreate" , async(interaction) => {
        if (interaction.isChatInputCommand()) {
            if(interaction.user.bot) return;
            
            const command = client33.allSlashCommands.get(interaction.commandName);
            
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
    
    
    client33.on("messageCreate" , async(message) => {
                      let client = message.client;
                      if (message.author.bot) return;
                      if (message.channel.type === 'dm') return;
                      
                      
                      if(!message.content.startsWith(prefix)) return;
                      const args = message.content.slice(prefix.length).trim().split(/ +/g); 
                      const cmd = args.shift().toLowerCase();
                      if(cmd.length == 0 ) return;
                      let command = client.commands.get(cmd)
                      if(!command) command = client33.commands.get(client.commandaliases.get(cmd));
                      
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
                  
                  await client33.login(Bot_token)
                  if(!all) {
                      await tokens.set(`all` , [{token:Bot_token,prefix:Bot_prefix,clientId:client33.user.id,owner:interaction.user.id,timeleft:2629744}])
                          

                  }else {
                      await tokens.push(`all` , {token:Bot_token,prefix:Bot_prefix,clientId:client33.user.id,owner:interaction.user.id,timeleft:2629744})
                      

                  }
                  
                }catch(error){
                console.error(error)
                return interaction.editReply({content:`**قم بتفعيل الخيارات الثلاثة او التاكد من توكن البوت ثم اعد المحاولة**`})
            }
        }
    }
}
}