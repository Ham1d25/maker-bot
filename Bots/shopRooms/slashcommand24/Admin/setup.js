const { SlashCommandBuilder,ChannelType, EmbedBuilder , TextInputBuilder ,TextInputStyle,ActionRowBuilder ,ModalBuilder ,PermissionsBitField } = require("discord.js");
const { Database } = require("st.db")
const db = new Database("/Json-db/Bots/shopRoomsDB.json")
module.exports = {
    ownersOnly:true,
    data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription(`تسطيب نظام رومات الشوب`)
    .addIntegerOption(Option => Option
        .setName(`openhour`)
        .setDescription(`ساعة فتح الرومات`)
        .setRequired(false))
        .addIntegerOption(Option => Option
            .setName(`openminute`)
            .setDescription(`دقيقة فتح الرومات`)
            .setRequired(false))
            .addIntegerOption(Option => Option
                .setName(`closehour`)
                .setDescription(`ساعة غلق الرومات`)
                .setRequired(false))
                .addIntegerOption(Option => Option
                    .setName(`closeminute`)
                    .setDescription(`دقيقة غلق الرومات`)
                    .setRequired(false))
                    .addChannelOption(Option => Option
                        .setName(`logroom`)
                        .setDescription(`روم اللوج`)
                        .setRequired(false))
                    .addChannelOption(Option => Option
                        .setName(`category`)
                        .setDescription(`كاتيجوري الرومات`)
                        .addChannelTypes(ChannelType.GuildCategory)
                        .setRequired(false))
                    , 
async execute(interaction) {
    let openhour = interaction.options.getInteger(`openhour`)
    let openminute = interaction.options.getInteger(`openminute`)
    let closehour = interaction.options.getInteger(`closehour`)
    let closeminute = interaction.options.getInteger(`closeminute`)
    let logroom = interaction.options.getChannel(`logroom`)
    let category = interaction.options.getChannel(`category`)
    
    if(openhour) {
        await db.set(`openhour_${interaction.guild.id}` , openhour)
    }
    if(openminute) {
        await db.set(`openminute_${interaction.guild.id}` , openminute)
    }
    if(closehour) {
        await db.set(`closehour_${interaction.guild.id}` , closehour)
    }
    if(closeminute) {
        await db.set(`closeminute_${interaction.guild.id}` , closeminute)
    }
    if(logroom) {
        await db.set(`logroom_${interaction.guild.id}` , logroom.id)
    }
    if(category) {
        await db.set(`category_${interaction.guild.id}` , category.id)
    }
    if(!openhour && !category && !openminute && !closehour && !closeminute && !logroom) return interaction.reply({content:`**لم يتم تحديد اي اعدادات**`})
    return interaction.reply({content:`**تم تحديد الاعدادات المحددة بنجاح**`})
}
}