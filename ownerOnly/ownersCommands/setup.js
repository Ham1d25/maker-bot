const { SlashCommandBuilder, EmbedBuilder ,StringSelectMenuBuilder,StringSelectMenuOptionBuilder, PermissionsBitField, ActionRowBuilder,ButtonBuilder,MessageComponentCollector,ButtonStyle, Embed } = require("discord.js");
const { Database } = require("st.db")
const setting = new Database("/database/settingsdata/setting")
const statuses = new Database("/database/settingsdata/statuses")
const prices = new Database("/database/settingsdata/prices.json")
const tokens = new Database("tokens/tokens")
const process = require('process'); 
let {mainguild} = require(`../../config.json`)
module.exports = {
    ownersOnly:true,
    data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('تسطيب النظام')
    .addUserOption(Option => Option
        .setName(`recipient`)
        .setDescription(`مستلم الارباح`)
        .setRequired(false))
        .addChannelOption(Option => Option
            .setName(`transferroom`)
            .setDescription(`روم تحويل من اجل شراء الرصيد`)
            .setRequired(false))
            .addChannelOption(Option => Option
                .setName(`logroom`)
                .setDescription(`روم لوج شراء البوتات`)
                .setRequired(false))
            .addChannelOption(Option => Option
                .setName(`panelroom`)
                .setDescription(`روم بانل شراء الرصيد`)
                .setRequired(false))
                .addChannelOption(Option => Option
                    .setName(`buybotroom`)
                    .setDescription(`روم بانل شراء البوتات`)
                    .setRequired(false))
                    
                        .addChannelOption(Option => Option
                            .setName(`statusroom`)
                            .setDescription(`روم الحالة للبوتات`)
                            .setRequired(false))
							  .addChannelOption(Option => Option
                            .setName(`dashboard`)
                            .setDescription(`روم داش بورد `)
                            .setRequired(false))
                .addRoleOption(Option => Option
                    .setName(`clientrole`)
                    .setDescription(`رول العملاء`)
                    .setRequired(false))
                .addUserOption(Option => Option
                    .setName(`probot`)
                    .setDescription(`البروبوت`)
                    .setRequired(false))
                    .addStringOption(text => text
                        .setName(`bot-message`)
                        .setDescription(`رسالة بانل البوتات`)
                        .setRequired(false))
                    
                    .addStringOption(text => text
                        .setName(`recipient-message`)
                        .setDescription(`رسالة بانل شراء العملات`)
                        .setRequired(false))
                     .addStringOption(text => text
                        .setName(`dashboard-message`)
                        .setDescription(`رسالة بانل الداش بورد`)
                        .setRequired(false))
                       
                     .addAttachmentOption(Option => Option
                        .setName(`line`)
                      .setDescription(`الخط`)
                      .setRequired(false))
        , // or false
async execute(interaction) {
    await interaction.deferReply({ephemeral:true})
    let recipient = interaction.options.getUser(`recipient`)
    let transferroom = interaction.options.getChannel(`transferroom`)
    let logroom = interaction.options.getChannel(`logroom`)
    let panelroom = interaction.options.getChannel(`panelroom`)
    let uptimeroom = interaction.options.getChannel(`uptimeroom`)
    let subscriberoom = interaction.options.getChannel(`subscriberoom`)
    let statusroom = interaction.options.getChannel(`statusroom`)
    let buybotroom = interaction.options.getChannel(`buybotroom`)
    let clientrole = interaction.options.getRole(`clientrole`)
    let probot = interaction.options.getUser(`probot`)
   let botmessage = interaction.options.getString(`bot-message`)
   let makermessage = interaction.options.getString(`maker-message`)
   let recipientmessage = interaction.options.getString(`recipient-message`)
   let dashboardmessage = interaction.options.getString(`dashboard-message`)
   let uptimemessage = interaction.options.getString(`uptime-message`)
   let line = interaction.options.getAttachment(`line`)
   let dashboard = interaction.options.getChannel(`dashboard`)
   if(recipient) {
   await setting.set(`recipient_${interaction.guild.id}` , recipient.id)
   }
   if(uptimeroom) {
    await setting.set(`uptimeroom_${interaction.guild.id}` , uptimeroom.id)
   }
   if (uptimemessage) {
    await setting.set(`message7_${interaction.guild.id}`, uptimemessage)
    }
	if (dashboard) {
    await setting.set(`dashboard_${interaction.guild.id}`, dashboard.id)
    }

   if(transferroom) {
    await setting.set(`transfer_room_${interaction.guild.id}` , transferroom.id)
   }
   if(logroom) {
    await setting.set(`log_room_${interaction.guild.id}` , logroom.id)
   }
   if(clientrole) {
    await setting.set(`client_role_${interaction.guild.id}` , clientrole.id)
   }
   if(probot) {
    await setting.set(`probot_${interaction.guild.id}` , probot.id)
}
if(panelroom) {
    await setting.set(`panel_room_${interaction.guild.id}` , panelroom.id)
   }
if(buybotroom) {
    await setting.set(`buy_bot_room${interaction.guild.id}` , buybotroom.id)
   }
   if(subscriberoom) {
      await setting.set(`subscribe_room_${interaction.guild.id}` , subscriberoom.id)
   }
   if (botmessage) {
    await setting.set(`message_${interaction.guild.id}`, botmessage)
}
if (makermessage) {
    await setting.set(`message1_${interaction.guild.id}`, makermessage)
}
if (recipientmessage) {
await setting.set(`message2_${interaction.guild.id}`, recipientmessage)
}
if (dashboardmessage) {
await setting.set(`message3_${interaction.guild.id}`, dashboardmessage)
}
   if(line) {
    await setting.set(`line_${interaction.guild.id}` , line.url)
   }
   if(statusroom) {
    if(setting.has(`statusroom_${interaction.guild.id}`)) {
        let messageInfo = setting.get(`statusmessageinfo_${interaction.guild.id}`)
        let {channelid , messageid} = messageInfo;
        const theChannel = interaction.guild.channels.cache.find(ch => ch.id == channelid)
        await theChannel.messages.fetch(messageid)
        const theMessages = await theChannel.messages.cache.find(ms => ms.id == messageid)
        await theMessages.delete();
    }
    await setting.set(`statusroom_${interaction.guild.id}` , statusroom.id);
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
            name:`بيع بروجكتات` , defaultPrice:15,tradeName:`seller`
        },
        {
            name:`قران` , defaultPrice:1,tradeName:`qran`
        },
		{
            name:`تيكت` , defaultPrice:20,tradeName:`ticket`
        },
        {
            name:`بيع منتجات` , defaultPrice:15,tradeName:`shop`
        },
        {
            name:`بيع رتب` , defaultPrice:15,tradeName:`sellrole`
        },
        {
            name:`اذكار` , defaultPrice:15,tradeName:`azkar`
        },
        {
            name:`طلبات` , defaultPrice:15,tradeName:`order`
        },
        {
            name:`جمع رتب` , defaultPrice:15,tradeName:`self`
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
        {
            name:`التكت` , defaultPrice:40,tradeName:`ticket`
        },
        {
            name:`كلل في واحد` , defaultPrice:70,tradeName:`all`
        }
    ]
    theBots.forEach(async(theBot) => {
        let theBotTokens = tokens.get(theBot.tradeName)
        let theBotStats = statuses.get(theBot.tradeName) ?? true
        embed1.addFields(
            {
                name:`**بوتات ${theBot.name} 🟢**` , value:`**السعر في السيرفر : \`${prices.get(theBot.tradeName+`_price_`+interaction.guild.id) ?? theBot.defaultPrice}\` عملة**\nعدد البوتات العامة : \`${theBotTokens.length ?? 0}\`` , inline:false
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
	embed1.setThumbnail(interaction.guild.iconURL({dynamic:true}))
    embed1.setFooter({text:interaction.guild.name , iconURL:interaction.guild.iconURL({dynamic:true})})

    const theMsg = await statusroom.send({embeds:[embed1]});
    await setting.set(`statusmessageinfo_${interaction.guild.id}` , {messageid:theMsg.id,channelid:theMsg.channel.id});
   }
   
   if(!recipient && ! uptimeroom&& ! uptimemessage && !line && !subscriberoom && !statusroom && !transferroom && !logroom && !clientrole && !probot && !panelroom && !buybotroom &&!botmessage && !makermessage && !recipientmessage  && !dashboardmessage && !line) return interaction.editReply({content:`**الرجاء تحديد اعداد واحد على الاقل**`}) 
   return interaction.editReply({content:`**تم تحديد الاعدادات بنجاح**`})
}
}