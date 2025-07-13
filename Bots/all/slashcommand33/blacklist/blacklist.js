const { SlashCommandBuilder, EmbedBuilder , PermissionsBitField } = require("discord.js");
const { Database } = require("st.db")
const allDB = new Database("/Json-db/Bots/allDB.json")
module.exports = {
    ownersOnly:true,
    data: new SlashCommandBuilder()
    .setName('blacklist')
    .setDescription('اعطاء او ازالة بلاك ليست')
    .addUserOption(Option => 
        Option
        .setName('user')
        .setDescription('الشخص')
        .setRequired(true)), // or false
async execute(interaction) {
    const user = interaction.options.getUser(`user`)
    const theuser = interaction.guild.members.cache.find(us => us.id == user.id)
    let dataFind = allDB.get(`blacklisted_${interaction.guild.id}`)
    if(!dataFind) {
        await allDB.set(`blacklisted_${interaction.guild.id}` , [])
    }
    dataFind = allDB.get(`blacklisted_${interaction.guild.id}`)
    const roleFind = allDB.get(`blacklist_role_${interaction.guild.id}`)
    if(!roleFind) {
        return interaction.reply({content:`**قم بتحديد رول البلاك ليست اولا**`})
    }
    if(!dataFind.includes(user.id)) {
        await allDB.push(`blacklisted_${interaction.guild.id}` , user.id)
        await theuser.roles.add(roleFind)
        return interaction.reply({content:`**تم اضافة الشخص الى قائمة البلاك ليست بنجاح**`})
    }else {
        let filtered = dataFind.filter(us => us != user.id)
        await allDB.set(`blacklisted_${interaction.guild.id}` , filtered)
        await theuser.roles.remove(roleFind)
        return interaction.reply({content:`**تم ازالة الشخص من البلاك ليست بنجاح**`})
    }
}
}