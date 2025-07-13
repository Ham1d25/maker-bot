const { Client, Collection,PermissionsBitField,SlashCommandBuilder, discord,GatewayIntentBits, Partials , EmbedBuilder, ApplicationCommandOptionType , Events , ActionRowBuilder , ButtonBuilder ,MessageAttachment, ButtonStyle , Message } = require("discord.js");
const { Database } = require("st.db")
const systemDB = new Database("/Json-db/Bots/systemDB.json")
module.exports = {
    ownersOnly:false,
    data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('حذف عدد من الرسائل')
    .addIntegerOption(Option => Option
        .setName(`number`)
        .setDescription(`عدد الرسائل`)
        .setRequired(true)), // or false
async execute(interaction) {
    if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return interaction.reply({content:`**لا تمتلك صلاحية لفعل ذلك**` , ephemeral:true})
    let number = interaction.options.getInteger(`number`)
    await interaction.reply({ephemeral:true , content:`Deleting messages ...`})
    await interaction.channel.messages.fetch({limit:100})
    await interaction.channel.bulkDelete(number).then(async(messages) => {
        await interaction.editReply({content:`**\`\`\`${messages.size} of messages , has been deleted\`\`\`**`})
        setTimeout(() => {
            return interaction.deleteReply()
        }, 1500);
    })
    
}
}