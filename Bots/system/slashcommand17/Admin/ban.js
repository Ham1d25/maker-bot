const { Client, Collection,PermissionsBitField,SlashCommandBuilder, discord,GatewayIntentBits, Partials , EmbedBuilder, ApplicationCommandOptionType , Events , ActionRowBuilder , ButtonBuilder ,MessageAttachment, ButtonStyle , Message } = require("discord.js");
const { Database } = require("st.db")
const systemDB = new Database("/Json-db/Bots/systemDB.json")
module.exports = {
    ownersOnly:false,
    data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('اعطاء بان لشخص او ازالته')
    .addUserOption(Option => Option
        .setName(`member`)
        .setDescription(`الشخص`)
        .setRequired(true))
        .addStringOption(Option => Option
            .setName(`reason`)
            .setDescription(`السبب`)
            .setRequired(false))
        , // or false
async execute(interaction) {
    if(!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return interaction.reply({content:`**لا تمتلك صلاحية لفعل ذلك**` , ephemeral:true})
   const member = interaction.options.getMember(`member`)
   const reason = `${interaction.options.getString(`reason`)} ,  By : ${interaction.user.id}` ?? `By : ${interaction.user.id}`
        await member.ban({reason:reason}).catch(async() => {return interaction.reply({content:`**الرجاء التحقق من صلاحياتي ثم اعادة المحاولة**` , ephemeral:true})})
        return interaction.reply({content:`**تم اعطاء البان الى الشخص بنجاح**`})
}
}