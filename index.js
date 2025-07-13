const { Client, Collection, discord,GatewayIntentBits, Partials , EmbedBuilder, ApplicationCommandOptionType , Events , ActionRowBuilder , ButtonBuilder ,MessageAttachment, ButtonStyle , Message } = require("discord.js");
const client = new Client({intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.MessageContent], shards: "auto", partials: [Partials.Message, Partials.Channel, Partials.GuildMember,]});
const client99 = new Client({intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.MessageContent], shards: "auto", partials: [Partials.Message, Partials.Channel, Partials.GuildMember,]});
const { readdirSync } = require("fs")
const moment = require("moment");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const path = require('node:path');
const fs = require('node:fs');
const mongodb = require('mongoose');
const ms = require("ms")
const { token , prefix , owner,owner1 , mainguild , database} = require(`./config.json`)
const { Database } = require("st.db")
const tokens = new Database("tokens/tokens")
const tier1subscriptions = new Database("/database/makers/tier1/subscriptions")
const tier2subscriptions = new Database("/database/makers/tier2/subscriptions")
const tier3subscriptions = new Database("/database/makers/tier3/subscriptions")
const tier3subscriptionsplus = new Database("/database/makers/tier3/plus")
const statuses = new Database("/database/settingsdata/statuses")
const setting = new Database("/database/settingsdata/setting")
const usersdata = new Database(`/database/usersdata/usersdata`);
const prices = new Database("/database/settingsdata/prices.json")
const config = require ("./config.json")
client.login(token).catch(err => console.log('❌ Token are not working'));
client.commandaliases = new Collection()

const rest = new REST({ version: '10' }).setToken(token);
module.exports = client;
//-
client.on("ready", async () => {
	try {
		await rest.put(
			Routes.applicationCommands(client.user.id),
			{ body: slashcommands },
		);
	} catch (error) {
		console.error(error);
	}
	await mongodb.connect(database , {
	}).then(async()=> {
		console.log('🟢 Connected To Database Successfully 🟢')
	}).catch(()=> {
		console.log(`🔴 Failed Connect To Database 🔴`)
	});
    console.log(`Done set everything`);
	
})
require('events').EventEmitter.defaultMaxListeners = 10; // أو أي عدد تراه مناسباً

client.on("ready" , async() => {
	setInterval(() => {
		let guilds = client.guilds.cache.forEach(async(guild) => {
		let messageInfo = setting.get(`statusmessageinfo_${guild.id}`)
		if(!messageInfo) return;
		const {messageid , channelid} = messageInfo;
		const theChan = guild.channels.cache.find(ch => ch.id == channelid)
        if(!theChan || !messageid) return;
		await theChan.messages.fetch(messageid).catch(() => {return;})
		const theMsg = await theChan.messages.cache.find(ms => ms.id == messageid)
		const embed1 = new EmbedBuilder()
    .setTitle(`**الحالة العامة للبوتات**`)
    const theBots = [
        {
            name:`التقديم` , defaultPrice:15,tradeName:`apply`
        },
        {
            name:`الخط التلقائي` , defaultPrice:15,tradeName:`autoline`
        },
        {
            name:`اذكار` , defaultPrice:15,tradeName:`azkar`
        },
        {
            name:`البلاك ليست` , defaultPrice:15,tradeName:`blacklist`
        },
        {
            name:`التحكم في البرودكاست` , defaultPrice:40,tradeName:`bc`
        },
		{
			name:`البرودكاست العادي` , defaultPrice:20,tradeName:`Broadcast2`
		},
        {
            name:`الكريدت الوهمي` , defaultPrice:15,tradeName:`credit`
        },
        {
            name:`الاراء` , defaultPrice:15,tradeName:`feedback`
        },
        {
            name:`الجيف اواي` , defaultPrice:15,tradeName:`giveaway`
        },
        {
            name:`اللوج` , defaultPrice:15,tradeName:`logs`
        },
        {
            name:`الناديكو` , defaultPrice:15,tradeName:`nadeko`
        },
        {
            name:`البروبوت بريميوم الوهمي` , defaultPrice:15,tradeName:`probot`
        },
		{
			name:`الحماية` , defaultPrice:20 , tradeName:`protect`
		},
        {
            name:`النصابين` , defaultPrice:15,tradeName:`scam`
        },
        {
            name:`الاقتراحات` , defaultPrice:15,tradeName:`suggestions`
        },
		{
			name:`السيستم` , defaultPrice:35 , tradeName:`system`
		},
        {
            name:`الضريبة` , defaultPrice:15,tradeName:`tax`
        },
    ]
    theBots.forEach(async(theBot) => {
        let theBotTokens = tokens.get(theBot.tradeName) ?? 0
        let theBotStats = statuses.get(theBot.tradeName) ?? true
        embed1.addFields(
            {
                name:`**بوتات ${theBot.name} 🟢**` , value:`**السعر في السيرفر : \`${prices.get(theBot.tradeName+`_price_`+guild.id) ?? theBot.defaultPrice}\` عملة**\nعدد البوتات العامة : \`${theBotTokens.length ?? 0}\`` , inline:false
            }
        )
    })
        
        
	const totalSeconds = process.uptime();
	const days = Math.floor(totalSeconds / (3600 * 24)); 
	const remainingSecondsAfterDays = totalSeconds % (3600 * 24);
	const hours = Math.floor(remainingSecondsAfterDays / 3600);
	const remainingSecondsAfterHours = remainingSecondsAfterDays % 3600;
	const minutes = Math.floor(remainingSecondsAfterHours / 60);
	const seconds = Math.floor(remainingSecondsAfterHours % 60);
    embed1.addFields(
        {
            name:`**تم الرفع لمدة :**` , inline:false,value:`**\`${days}\` Days,\`${hours}\` Hours , \`${minutes}\` Minutes , \`${seconds}\` Seconds  بدون انقطاع**`
        }
    )
	embed1.setColor('DarkGold')
	embed1.setThumbnail(guild.iconURL({dynamic:true}))
	embed1.setFooter({text:guild.name , iconURL:guild.iconURL({dynamic:true})})

		try {
			await theMsg.edit({embeds:[embed1]});
		} catch {
			return;
		}
	})
	}, 60 * 1000);
})
client.slashcommands = new Collection()
const slashcommands = [];
 const ascii = require('ascii-table');
const { setMaxListeners } = require("events");
const table = new ascii('Owner Commands').setJustify();
for (let folder of readdirSync('./ownerOnly/').filter(folder => !folder.includes('.'))) {
  for (let file of readdirSync('./ownerOnly/' + folder).filter(f => f.endsWith('.js'))) {
	  let command = require(`./ownerOnly/${folder}/${file}`);
	  if(command) {
		  slashcommands.push(command.data.toJSON());
  client.slashcommands.set(command.data.name, command);
		  if(command.data.name) {
			  table.addRow(`/${command.data.name}` , '🟢 Working')
		  }
		  if(!command.data.name) {
			  table.addRow(`/${command.data.name}` , '🔴 Not Working')
		  }
	  }
  }
}
console.log(table.toString())

for (let folder of readdirSync('./events/').filter(folder => !folder.includes('.'))) {
	for (let file of readdirSync('./events/' + folder).filter(f => f.endsWith('.js'))) {
		const event = require(`./events/${folder}/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
	}
  }
  for (let folder of readdirSync('./buttons/').filter(folder => !folder.includes('.'))) {
	for (let file of readdirSync('./buttons/' + folder).filter(f => f.endsWith('.js'))) {
		const event = require(`./buttons/${folder}/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
	}
  }
 
//nodejs-events
process.on("unhandledRejection", e => { 
	console.log(e)
  }) 
 process.on("uncaughtException", e => { 
	console.log(e)
  })  
 process.on("uncaughtExceptionMonitor", e => { 
	console.log(e)
  })

	//-

//- عدم دخول السيرفرات غير المشتركة - Leave from servers didnt subscribe

const bottokens = new Database("buttons/botsSubmit/tokengen.json");


client.on('ready' , async() => {
	try {
		let guilds = client.guilds.cache.forEach(async(guild) => {
		let filtered = config.mainguild
		if(!filtered) {
			if(guild.id == mainguild) return;
			await guild.leave();
		}
	})
	} catch (error) {
		return
	}
	
})
client.on("messageCreate" , async(message) => {
	if(message.content == `<@${client.user.id}>`) {
		if(message.author.bot) return;
		return message.reply({content:`**Hello In <@${client.user.id}> , Im Using ${prefix} Commands**`})
	}
})
client.on("guildCreate" , async(guild) => {
	let subscriptions1 = tier1subscriptions.get(`tier1_subs`)
		let filtered = config.mainguild
		if(!filtered) {
			if(guild.id == mainguild) return;
			await guild.leave();
		}
})


	//-
client.on("messageCreate" , async(message) => {
	const transfer_room = setting.get(`transfer_room_${message.guild.id}`)
	const probot = setting.get(`probot_${message.guild.id}`)
	if(!probot && !transfer_room) return;
	if(message.author.id == probot) return;
	if(message.channel.id != transfer_room) return;
	if(message.author.id == client.user.id) return;
	setTimeout(() => {
		try {
			message.delete().catch(async() => {return;})
		} catch (error) {
			return
		}
	}, 15000);
})

client.on('messageCreate' , async(message) => {
	const transfer_room = setting.get(`transfer_room_${message.guild.id}`)
	const probot = setting.get(`probot_${message.guild.id}`)
	if(!probot && !transfer_room) return;
	if(message.channel.id == transfer_room) {
		if(message.author.id == client.user.id) return;
		if(message.author.id == probot) {
			if(message.content.includes("has transferred")) {
				let line = setting.get(`line_${message.guild.id}`) ?? "https://cdn.discordapp.com/attachments/708103524193665206/875223917462171698/2c_1.gif"
				if(!line) line = `https://cdn.discordapp.com/attachments/708103524193665206/875223917462171698/2c_1.gif`
				message.channel.send({files:[
					{
						name:`line.png`,attachment:line
					}
				]})
			}
			else{
				setTimeout(() => {
					try {
						message.delete().catch(async() => {return;})
					} catch (error) {
						return
					}
				}, 15000);
			}
		}
	}
})


require('./Bots/Broadcast/Broadcast-Bots')
require('./Bots/azkar/azkar-Bots')
require('./Bots/self/self-Bots')
require('./Bots/NormalBroadcast/Broadcast-Bots')
require('./Bots/tax/Tax-Bots')
require('./Bots/scammers/Scammers-Bots')
require('./Bots/logs/logs-Bots')
require('./Bots/ticket/ticket-Bots')
require('./Bots/blacklist/blacklist-Bots')
require('./Bots/probot/probot-Bots')
require('./Bots/autoline/autoline-Bots')
require('./Bots/feedback/feedback-Bots')
require('./Bots/suggestions/suggestions-Bots')
require('./Bots/apply/apply-Bots')
require('./Bots/giveaway/giveaway-Bots')
require('./Bots/nadeko/nadeko-Bots')
require('./Bots/credit/credit-Bots')
require('./Bots/system/system-Bots')
require('./Bots/protect/protect-Bots')
require('./Bots/seller/seller-Bots')
require('./Bots/shop/Shop-Bots')
require('./Bots/privateRooms/privateRooms-Bots') 
require('./Bots/quran/quran-Bots') 
require('./Bots/roles/roles-Bots') 
require('./Bots/shopRooms/shopRooms-Bots') 
require('./Bots/all/all-Bots')



client.on("ready" , async() => {
	setInterval(async() => {
		let BroadcastTokens = await tier1subscriptions.get(`tier1_subs`)
	if(!BroadcastTokens)return;
	if(BroadcastTokens.length <= 0) return;
	BroadcastTokens.forEach(async(data) => {
		let {token , prefix , owner , timeleft} = data;
		if(timeleft > 0) {
			timeleft = timeleft - 1
			data.timeleft = timeleft
			await tier1subscriptions.set(`tier1_subs` , BroadcastTokens)
		}else if(timeleft <= 0) {
			const filtered = BroadcastTokens.filter(bo => bo != data)
			await tier1subscriptions.set(`tier1_subs` , filtered)
		}
	});
	},1000)
	setInterval(async() => {
		let BroadcastTokens = await tier2subscriptions.get(`tier2_subs`)
	if(!BroadcastTokens)return;
	if(BroadcastTokens.length <= 0) return;
	BroadcastTokens.forEach(async(data) => {
		let {token , prefix , owner , timeleft} = data;
		if(timeleft > 0) {
			timeleft = timeleft - 1
			data.timeleft = timeleft
			await tier2subscriptions.set(`tier2_subs` , BroadcastTokens)
		}else if(timeleft <= 0) {
			const filtered = BroadcastTokens.filter(bo => bo != data)
			await tier2subscriptions.set(`tier2_subs` , filtered)
		}
	});
	},1000)
	setInterval(async() => {
		let BroadcastTokens = await tier3subscriptions.get(`tier3_subs`)
	if(!BroadcastTokens)return;
	if(BroadcastTokens.length <= 0) return;
	BroadcastTokens.forEach(async(data) => {
		let {token , prefix , owner , timeleft} = data;
		if(timeleft > 0) {
			timeleft = timeleft - 1
			data.timeleft = timeleft
			await tier3subscriptions.set(`tier3_subs` , BroadcastTokens)
		}else if(timeleft <= 0) {
			const filtered = BroadcastTokens.filter(bo => bo != data)
			await tier3subscriptions.set(`tier3_subs` , filtered)
		}
	});
	},1000)
})