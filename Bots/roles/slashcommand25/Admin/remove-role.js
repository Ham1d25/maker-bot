const { SlashCommandBuilder,ChannelType, EmbedBuilder , TextInputBuilder ,TextInputStyle,ActionRowBuilder ,ModalBuilder ,PermissionsBitField } = require("discord.js");
const { Database } = require("st.db")
const db = new Database("/Json-db/Bots/rolesDB.json")
module.exports = {
    ownersOnly:true,
    data: new SlashCommandBuilder()
    .setName('remove-role')
    .setDescription(`ازالة رتبة من البيع`)
    .addRoleOption(Option => Option
        .setName(`role`)
        .setDescription(`الرتبة`)
        .setRequired(true)), 
async execute(interaction) {
    let role = interaction.options.getRole(`role`)
    let roles = await db.get(`roles_${interaction.guild.id}`)
    if(!roles) {
        await db.set(`roles_${interaction.guild.id}` , [])
    }
     roles = await db.get(`roles_${interaction.guild.id}`)
    let roleFind = await roles.find(ro => ro.roleId == role.id)
    if(!roleFind) {
        return interaction.reply({content:`**هذه الرتبة غير متوفرة للبيع للأزالة**`})
    }
    let filtered = await roles.filter(ro => ro.roleId != role.id)
    await db.set(`roles_${interaction.guild.id}` , filtered)
    return interaction.reply({content:`**تم ازالة الرتبة من البيع بنجاح**`})
}
}