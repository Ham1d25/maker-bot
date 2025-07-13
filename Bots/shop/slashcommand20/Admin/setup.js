const { SlashCommandBuilder, EmbedBuilder , PermissionsBitField } = require("discord.js");
const { Database } = require("st.db")
const db = new Database("/Json-db/Bots/shopDB.json")
module.exports = {
    ownersOnly:true,
    data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('تسطيب الاعدادات الرئيسية')
    .addUserOption(Option => Option
        .setName(`recipient`)
        .setDescription(`مستلم الارباح`)
        .setRequired(false))
    .addUserOption(Option => Option
        .setName(`probot`)
        .setDescription(`البروبوت`)
        .setRequired(false))
        .addRoleOption(Option => Option
            .setName(`clientrole`)
            .setDescription(`رول العملاء`)
            .setRequired(false)), 
async execute(interaction) {
       await interaction.deferReply({ephemeral:false})
       let recipient = interaction.options.getUser(`recipient`)
       let probot = interaction.options.getUser(`probot`)
       let clientrole = interaction.options.getRole(`clientrole`)
       if(recipient) {
           await db.set(`recipient_${interaction.guild.id}` , recipient.id)
        }
       if(probot) {
           await db.set(`probot_${interaction.guild.id}` , probot.id)
        }

        if(clientrole) {
            await db.set(`clientrole_${interaction.guild.id}` , clientrole.id)
         }
         if(!recipient && !clientrole && !probot) {
            return interaction.editReply({content:`**الرجاء تحديد واحد من الاعدادات على الاقل**`})
         }
         return interaction.editReply({content:`**تم تحديد الاعدادات المحددة بنجاح**`})
}
}