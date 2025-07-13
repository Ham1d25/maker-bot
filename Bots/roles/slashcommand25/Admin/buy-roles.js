const { SlashCommandBuilder,ChannelType,StringSelectMenuBuilder,StringSelectMenuOptionBuilder, EmbedBuilder , TextInputBuilder ,TextInputStyle,ActionRowBuilder ,ModalBuilder ,PermissionsBitField, Embed } = require("discord.js");
const { Database } = require("st.db")
const db = new Database("/Json-db/Bots/rolesDB.json")
module.exports = {
    data: new SlashCommandBuilder()
    .setName('buy-role')
    .setDescription(`شراء رتبة`),
async execute(interaction) {
    if(!interaction.channel.name.startsWith(`ticket`)) return interaction.reply({content:`**الامر يعمل في التكت فقط**`})
   let recipient = await db.get(`recipient_${interaction.guild.id}`)
   let probot = await db.get(`probot_${interaction.guild.id}`)
   if(!recipient || !probot) return interaction.reply({content:`**لم يتم تحديد الاعدادت من قبل الاونر لكي يتم شراء رتبة**`})
   let roles = await db.get(`roles_${interaction.guild.id}`)
   if(!roles) {
       await db.set(`roles_${interaction.guild.id}` , [])
   }
    roles = await db.get(`roles_${interaction.guild.id}`)
    if(roles.length <= 0) return interaction.reply({content:`**لا يوجد رتب متوفرة للبيع**`})
    let embed1 = new EmbedBuilder()
.setTitle(`**الرجاء تحديد الرتبة التي تود شرائها**`)
.setTimestamp()
let row = new ActionRowBuilder()
const select = new StringSelectMenuBuilder()
.setCustomId('roles_select')
.setPlaceholder('حدد الرتبة التي تود شرائها')
roles.forEach(async(role) => {
    select.addOptions(
        new StringSelectMenuOptionBuilder()
            .setLabel(`${role.roleName}`)
            .setDescription(`سعر الرتبة : ${role.price}`)
            .setValue(`${role.roleName}`),
    )
    
})
row.addComponents(select)
return interaction.reply({content:`${interaction.user}`,embeds:[embed1], components:[row]})
}
}