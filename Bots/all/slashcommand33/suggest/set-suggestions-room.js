const { SlashCommandBuilder, EmbedBuilder , PermissionsBitField } = require("discord.js");
const { Database } = require("st.db")
const allDB = new Database("/Json-db/Bots/allDB.json")
module.exports = {
    ownersOnly:true,
    data: new SlashCommandBuilder()
    .setName('set-suggestions-room')
    .setDescription('تحديد روم الاقتراحات')
    .addChannelOption(Option => 
        Option
        .setName('room')
        .setDescription('الروم')
        .setRequired(true)), // or false
async execute(interaction) {
    try{
    const room = interaction.options.getChannel(`room`)
    await allDB.set(`suggestions_room_${interaction.guild.id}` , room.id)
    return interaction.reply({content:`**تم تحديد الروم بنجاح**`})
} catch  {
    return;
}
}
}