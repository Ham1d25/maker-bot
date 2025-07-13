const { SlashCommandBuilder,ChannelType, EmbedBuilder , TextInputBuilder ,TextInputStyle,ActionRowBuilder ,ModalBuilder ,PermissionsBitField } = require("discord.js");
const { Database } = require("st.db")
const db = new Database("/Json-db/Bots/rolesDB.json")
module.exports = {
    ownersOnly:true,
    data: new SlashCommandBuilder()
    .setName('add-role')
    .setDescription(`اضافة رتبة للبيع`)
    .addRoleOption(Option => Option
        .setName(`role`)
        .setDescription(`الرتبة`)
        .setRequired(true))
        .addIntegerOption(Option => Option
            .setName(`price`)
            .setDescription(`السعر`)
            .setRequired(true)), 
async execute(interaction) {
    let role = interaction.options.getRole(`role`)
    let price = interaction.options.getInteger(`price`)
    let roles = await db.get(`roles_${interaction.guild.id}`)
    if(!roles) {
        await db.set(`roles_${interaction.guild.id}` , [])
    }
    await db.push(`roles_${interaction.guild.id}` , 
    {
        roleName:role.name,
        roleId:role.id,
        price:price
    })
    return interaction.reply({content:`**تم وضع الرتبة للبيع بنجاح**`})
}
}