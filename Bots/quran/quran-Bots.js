
const { Client, Collection,ChannelType ,SlashCommandBuilder, GatewayIntentBits, Partials , EmbedBuilder, ApplicationCommandOptionType , Events , ActionRowBuilder , ButtonBuilder , ButtonStyle , Message, Embed,PermissionsBitField } = require("discord.js")
const { Database } = require("st.db")
const azkarDB = new Database("/Json-db/Bots/azkarDB.json")
const tokens = new Database("/tokens/tokens")
const tier1subscriptions = new Database("/database/makers/tier1/subscriptions")
const ytdl = require('ytdl-core');
const { joinVoiceChannel,getVoiceConnection, createAudioPlayer, createAudioResource, NoSubscriberBehavior } = require('@discordjs/voice');


let moment = require('moment');
const ms = require("ms")
const buyCooldown = new Collection()
let quran = tokens.get('quran')
if(!quran) return;

const path = require('path');
const { readdirSync } = require("fs");
const client = require("../../index.js")
const { connect } = require("http2")
let theowner;
quran.forEach(async(data) => {
  const { REST } = require('@discordjs/rest');
  const { Routes } = require('discord-api-types/v10');
  const { prefix , token , clientId , owner } = data;
  theowner = owner
  const client26 = new Client({intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.MessageContent], shards: "auto", partials: [Partials.Message, Partials.Channel, Partials.GuildMember,]});
  client26.commands = new Collection();
  client26.setMaxListeners(1000)
  require(`./handlers/events.js`)(client26);
  client26.events = new Collection();
  require(`../../events/requireBots/quran-commands.js`)(client26);
  const rest = new REST({ version: '10' }).setToken(token);
  client26.on("ready" , async() => {

      try {
        await rest.put(
          Routes.applicationCommands(client26.user.id),
          { body: azkarSlashCommands },
          );
          
        } catch (error) {
          console.error(error)
        }

    });
    require(`./handlers/events.js`)(client26)
  const folderPath = path.join(__dirname, 'slashcommand26');
  client26.azkarSlashCommands = new Collection();
  const azkarSlashCommands = [];
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
          azkarSlashCommands.push(command.data.toJSON());
          client26.azkarSlashCommands.set(command.data.name, command);
          if (command.data.name) {
            table.addRow(`/${command.data.name}`, "🟢 Working");
          } else {
            table.addRow(`/${command.data.name}`, "🔴 Not Working");
          }
        }
  }
}

let commandsDir2 = path.join(__dirname);
client26.commands = new Collection()
const commands = [];
const table2 = new ascii('Prefix Commands').setJustify();
for (let folder of readdirSync(commandsDir2+`/commands26`).filter(f => f.endsWith(`.js`))) {
	  let command = require(`${commandsDir2}/commands26/${folder}`);
	  if(command) {
		commands.push(command);
  client26.commands.set(command.name, command);
		  if(command.name) {
			  table2.addRow(`${prefix}${command.name}` , '🟢 Working')
		  }
		  if(!command.name) {
			  table2.addRow(`${prefix}${command.name}` , '🔴 Not Working')
		  }
	  }
}


require(`../../events/requireBots/quran-commands.js`)(client26)
require("./handlers/events.js")(client26)

	for (let file of readdirSync('./events/').filter(f => f.endsWith('.js'))) {
		const event = require(`./events/${file}`);
	if (event.once) {
		client26.once(event.name, (...args) => event.execute(...args));
	} else {
		client26.on(event.name, (...args) => event.execute(...args));
	}
	}

client26.on("messageCreate" , async(message) => {
  if (message.author.bot) return;
  if (message.channel.type === 'dm') return;
  if(!message.content.startsWith(prefix)) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/g); 
  const cmd = args.shift().toLowerCase();
  if(cmd.length == 0 ) return;
    if(!client26.commands.has(cmd)) return;
  let command = client26.commands.get(cmd)
  if(!command) command = client26.commands.get(client26.commandaliases.get(cmd));

  if(command) {
    if(command.cooldown) {
        
      if(cooldown.has(`${command.name}${message.author.id}`)) return message.reply({ embeds:[{description:`**عليك الانتظار\`${ms(cooldown.get(`${command.name}${message.author.id}`) - Date.now(), {long : true}).replace("minutes", `دقيقة`).replace("seconds", `ثانية`).replace("second", `ثانية`).replace("ms", `ملي ثانية`)}\` لكي تتمكن من استخدام الامر مجددا.**`}]}).then(msg => setTimeout(() => msg.delete(), cooldown.get(`${command.name}${message.author.id}`) - Date.now()))
      command.run(client, message, args)
      cooldown.set(`${command.name}${message.author.id}`, Date.now() + command.cooldown)
      setTimeout(() => {
        cooldown.delete(`${command.name}${message.author.id}`)
      }, command.cooldown);
  } else {
    command.run(client, message, args)
  }
}});



  client26.on("interactionCreate" , async(interaction) => {
    if (interaction.isChatInputCommand()) {
      
	    if(interaction.user.bot) return;

      
      const command = client26.azkarSlashCommands.get(interaction.commandName);
	    
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
  

   client26.login(token)
   .catch(async(err) => {
    const filtered = quran.filter(bo => bo != data)
			await tokens.set(`quran` , filtered)
      console.log(`${clientId} Not working and removed `)
   });


})
