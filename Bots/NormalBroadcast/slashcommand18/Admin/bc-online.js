const { SlashCommandBuilder, EmbedBuilder ,ButtonStyle, PermissionsBitField, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const { Database } = require("st.db")
const db = new Database("/Json-db/Bots/BroadcastDB")
const { theowner} = require('../../Broadcast-Bots');
module.exports = {
    ownersOnly:true,
    data: new SlashCommandBuilder()
    .setName('bc-online')
    .setDescription('ارسال رسالة برودكاست الى الاعضاء الاونلاين')
    .addStringOption(Option => Option
        .setName(`themessage`)
        .setDescription(`الرسالة`)
        .setRequired(true)), // or false
async execute(interaction) {
    await interaction.deferReply({ephemeral:false})
    try {
        const themessage = interaction.options.getString(`themessage`)
      await interaction.guild.members.fetch()
        await interaction.editReply({content:`**تم البدأ في ارسال البرودكاست للاعضاء الاونلاين**`})
       await interaction.guild.members.cache.forEach(async(member) => {
        if(member.user.bot) return;
        let a = member.presence
        if(!a) return;
        if(a.status == "offline" || a.status === "offline") return;
            await member.send({content:`${themessage} \n ${member}`}).catch(() => {})
        })
            await interaction.editReply({content:`**تم الانتهاء من الارسال البرودكاست للاعضاء الاونلاين**`})
    } catch {
    }
}
}