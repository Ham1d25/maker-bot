const { SlashCommandBuilder,SelectMenuBuilder,StringSelectMenuBuilder, StringSelectMenuOptionBuilder, EmbedBuilder , PermissionsBitField, ActionRowBuilder,ButtonBuilder,MessageComponentCollector,ButtonStyle, Embed } = require("discord.js");
const { Database } = require("st.db")
const db = new Database("/database/data")
const setting = new Database("/database/settingsdata/setting")
const image = new Database("/database/settingsdata/image")

module.exports = {
    ownersOnly:true,
    data: new SlashCommandBuilder()
    .setName('send-buy-bot-panel')
    .setDescription(`ارسال بانل شراء البوتات`),
async execute(interaction) {
    await interaction.deferReply({ephemeral:true})
    let price1 = await setting.get(`balance_price_${interaction.guild.id}`) ?? 5000;
    let recipient = await setting.get(`recipient_${interaction.guild.id}`)
    let logroom =  await setting.get(`log_room_${interaction.guild.id}`)
    let probot = await setting.get(`probot_${interaction.guild.id}`)
    let clientrole = await setting.get(`client_role_${interaction.guild.id}`)
    let buybotroom = await setting.get(`buy_bot_room${interaction.guild.id}`)
    let message = await setting.get(`message_${interaction.guild.id}`)
    if(!price1 || !recipient || !logroom || !probot || !clientrole || !buybotroom || !message) return interaction.editReply({content:`**لم يتم تحديد الاعدادات**`})
    let theroom = interaction.guild.channels.cache.find(ch => ch.id == buybotroom)
    let embed = new EmbedBuilder()
    .setTitle(`**> بـانــل شــراء بــوت**`)
    
.setThumbnail(interaction.guild.iconURL())
.setColor('#0000FF');
    if (message){
        let message1 = message.replace(/\\n/g, '\n');
        embed.setDescription(`${message1}`)
    }
    
    const select = new StringSelectMenuBuilder()
    .setCustomId('select_bot')
    .setPlaceholder(' 🛒 قم بأختيار البوت من القائمة')
    .addOptions(
        new StringSelectMenuOptionBuilder()
            .setLabel('تــقــدڀــمــات')
            .setDescription('شــراء بــوت تــقــدڀــمــات')
            .setEmoji('📝')
            .setValue('BuyApply'),
            new StringSelectMenuOptionBuilder()
            .setLabel('ڂــط  تــلــڦــائــي')
            .setDescription('شــراء بــوت ڂــط  تــلــڦــائــي')
            .setEmoji('📏')
            .setValue('BuyAutoline'),
            new StringSelectMenuOptionBuilder()
            .setLabel('بيع منتجات')
            .setDescription('شــراء بــوت بيع منتجات  ')
            .setEmoji('🛒')
            .setValue('BuyShop'),
            new StringSelectMenuOptionBuilder()
            .setLabel('بــلاك لــيــســت')
            .setDescription('شــراء بــوت بــلاك لــيــســت')
            .setEmoji('🔏')
            .setValue('BuyBlacklist'),
            new StringSelectMenuOptionBuilder()
            .setLabel('بــرودكـا̍ســت')
            .setDescription('شــراء بــوت بــرودكـا̍ســت ּ')
            .setEmoji('🖥')
            .setValue('BuyBroadcast'),
            new StringSelectMenuOptionBuilder()
            .setLabel('اراء')
            .setDescription('شــراء بــوت اراء')
            .setEmoji('🎇')
            .setValue('BuyFeedback'),
            new StringSelectMenuOptionBuilder()
            .setLabel('جــيــف اوي')
            .setDescription('شــراء بــوت جــيــف اوي')
            .setEmoji('🎁')
            .setValue('BuyGiveaway'),
            new StringSelectMenuOptionBuilder()
            .setLabel('لــوج')
            .setDescription('شــراء بــوت لــوج')
            .setEmoji('💾')
            .setValue('BuyLogs'),
            new StringSelectMenuOptionBuilder()
            .setLabel('بــروبــوت')
            .setDescription('شــراء بــوت  بــروبــوت بــريــمــيــوم ')
             .setEmoji('📀')
            .setValue('BuyProbot'),
            new StringSelectMenuOptionBuilder()
            .setLabel('اقــتــراحـات')
            .setDescription('شــراء بــوت اقــتــراحـات')
            .setEmoji('🩹')
            .setValue('BuySuggestions'),
            new StringSelectMenuOptionBuilder()
            .setLabel('̨ضــريــبــة')
            .setDescription('شــراء بــوت ̨ضــريــبــة')
            .setEmoji('💸')
            .setValue('BuyTax'),
            new StringSelectMenuOptionBuilder()
            .setLabel('الكل في واحد')
            .setDescription('شــراء بــوت الكل في واحد')
            .setEmoji('🌍')
            .setValue('Buyall'),
            new StringSelectMenuOptionBuilder()
            .setLabel('اﻋـادۃ ۛتــعــيــيــن')
            .setDescription('̨ﻋــمــل اﻋـادۃ ۛتــعــيــيــن لــلاخــتــيـار')
            .setEmoji('🔁')
            .setValue('Reset_Selected'),
    );
    const select2 = new StringSelectMenuBuilder()
    .setCustomId('select_bot2')
    .setPlaceholder(' 🛒 قم بأختيار البوت من القائمة الثانية')
    .addOptions(
       new StringSelectMenuOptionBuilder()
                .setEmoji('💵')
                .setLabel('بيع رتب')
                .setDescription('شراء بوت شراء رتب')
                .setValue('BuyRoles')
 )
    const row = new ActionRowBuilder()
    .addComponents(select);
    const row2 = new ActionRowBuilder()
    .addComponents(select2);

const free = new ButtonBuilder()
    .setCustomId(`showinfo`)
    .setEmoji('❕')
    .setStyle(ButtonStyle.Primary);

const free1 = new ButtonBuilder()
    .setCustomId(`select_how`)
    .setEmoji('🤖')
    .setStyle(ButtonStyle.Danger);

const row3 = new ActionRowBuilder()
    .addComponents(free,free1);
    theroom.send({ embeds:[embed],components:[row ,row2, row3]})
    return interaction.editReply({content:`**تم ارسال بانل شراء البوتات**`})
}

}