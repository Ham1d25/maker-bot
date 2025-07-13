const { Client, Collection,PermissionsBitField,SlashCommandBuilder, discord,GatewayIntentBits, Partials , EmbedBuilder, ApplicationCommandOptionType , Events , ActionRowBuilder , ButtonBuilder ,MessageAttachment, ButtonStyle , Message } = require("discord.js");
const { Database } = require("st.db")
const systemDB = new Database("/Json-db/Bots/systemDB.json")
module.exports = {
    ownersOnly:false,
    data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('اعطاء تايم اوت لشخص او ازالته')
    .addUserOption(Option => Option
        .setName(`member`)
        .setDescription(`الشخص`)
        .setRequired(true))
        .addIntegerOption(Option => Option
            .setName(`time`)
            .setDescription(`الوقت`)
            .setRequired(true))
            .addStringOption(Option => Option
                .setName(`reason`)
                .setDescription(`السبب`)
                .setRequired(false))
        , // or false
async execute(interaction) {
    if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return interaction.reply({content:`**لا تمتلك صلاحية لفعل ذلك**` , ephemeral:true})
   const member = interaction.options.getMember(`member`)
   let time = interaction.options.getInteger(`time`) + 1
   const reason = interaction.options.getString(`reason`) ?? "No reason"
   await member.timeout(time * 60 * 1000 , reason)
        return interaction.reply({content:`**تم اعطاء التايم اوت الى الشخص بنجاح**`})
}
}