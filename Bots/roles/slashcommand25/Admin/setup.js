const { SlashCommandBuilder,ChannelType, EmbedBuilder , TextInputBuilder ,TextInputStyle,ActionRowBuilder ,ModalBuilder ,PermissionsBitField } = require("discord.js");
const { Database } = require("st.db")
const db = new Database("/Json-db/Bots/rolesDB.json")
module.exports = {
    ownersOnly:true,
    data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription(`تسطيب نظام بيع الرتب`)
    .addUserOption(Option => Option
        .setName(`recipient`)
        .setDescription(`مستلم الارباح`)
        .setRequired(false))
        .addUserOption(Option => Option
            .setName(`probot`)
            .setDescription(`البروبوت`)
            .setRequired(false)), 
async execute(interaction) {
    let recipient = interaction.options.getUser(`recipient`)
    let probot = interaction.options.getUser(`probot`)
    if(recipient) {
        await db.set(`recipient_${interaction.guild.id}` , recipient.id)
    }
    if(probot) {
        await db.set(`probot_${interaction.guild.id}` , probot.id)
    }

    if(!recipient && !probot) {
        return interaction.reply({content:`**الرجاء تحديد اعداد واحد على الاقل**`})
    }

    return interaction.reply({content:`**تم تحديد الاعدادات المحددة بنجاح**`})
    
}
}