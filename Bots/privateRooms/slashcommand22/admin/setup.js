const { Client, Collection,ChannelType ,SlashCommandBuilder, GatewayIntentBits, Partials , EmbedBuilder, ApplicationCommandOptionType , Events , ActionRowBuilder , ButtonBuilder , ButtonStyle , Message } = require("discord.js");
const { Database } = require("st.db")
const db = new Database("/Json-db/Bots/privateRoomsDB.json")

module.exports ={
    ownersOnly:true,
    data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('تسطيب نظام الرومات الخاصة')
    .addUserOption(Option => Option
        .setName(`recipient`)
        .setDescription(`مستلم الارباح`)
        .setRequired(false))
        .addChannelOption(Option => Option
            .setName(`category`)
            .setDescription(`كاتيجوري الرومات`)
            .addChannelTypes(ChannelType.GuildCategory)
            .setRequired(false))
            .addIntegerOption(Option => Option
                .setName(`roomprice`)
                .setDescription(`سعر الروم`)
                .setRequired(false))
                .addIntegerOption(Option => Option
                    .setName(`renewprice`)
                    .setDescription(`سعر التجديد`)
                    .setRequired(false))
                    .addRoleOption(Option => Option
                        .setName(`role`)
                        .setDescription(`الرتبة`)
                        .setRequired(false)),
    async execute(interaction, client) {
       let recipient = interaction.options.getUser(`recipient`)
       let category = interaction.options.getChannel(`category`)
       let roomprice = interaction.options.getInteger(`roomprice`)
       let renewprice = interaction.options.getInteger(`renewprice`)
       let role = interaction.options.getRole(`role`)
       if(recipient){
        await db.set(`recipient_${interaction.guild.id}` , recipient.id)
       }
       if(category){
        await db.set(`category_${interaction.guild.id}` , category.id)
       }
       if(roomprice){
        await db.set(`roomprice_${interaction.guild.id}` , roomprice)
       }
       if(renewprice){
        await db.set(`renewprice_${interaction.guild.id}` , renewprice)
       }
       if(role){
        await db.set(`role_${interaction.guild.id}` , role.id)
       }
       if(!recipient && !category && !roomprice && !renewprice && !role) return interaction.reply({content:`**لم يتم تحديد اعداد واحد على الاقل**`})
       return interaction.reply({content:`**تم تحديد الاعدادات المختارة بنجاح**`})
    }
}