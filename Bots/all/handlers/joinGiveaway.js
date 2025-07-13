const { SlashCommandBuilder,Events ,Client, ActivityType,ModalBuilder,TextInputStyle, EmbedBuilder , PermissionsBitField,ButtonStyle, TextInputBuilder, ActionRowBuilder,ButtonBuilder,MessageComponentCollector } = require("discord.js");
const { Database } = require("st.db");
const allDB = new Database("/Json-db/Bots/allDB.json")
const ms = require("ms")
module.exports = (client33) => {
    client33.on(Events.InteractionCreate , async(interaction) =>{
    if(interaction.isButton()) {
        if(interaction.customId == "join_giveaway") {
            await interaction.deferReply({ephemeral:true})
            let giveaways = allDB.get(`giveaways_${interaction.guild.id}`)
            const msgid = interaction.message.id;
            const giveaway = giveaways.find(gu => gu.messageid == msgid)
            if(!giveaway) return interaction.editReply({content:`**لم يتم العثور على هذا الجيف اواي**` , ephemeral:true})
            let {messageid , channelid , entries , winners , prize , duration,dir1,dir2,host} = giveaway;
        if(!entries.includes(`<@${interaction.user.id}>`)) {
        entries.push(`<@${interaction.user.id}>`)
        await allDB.set(`giveaways_${interaction.guild.id}` , giveaways)
        const embed = new EmbedBuilder()
.setTitle(`**${prize}**`)
.setDescription(`Ends : <t:${dir1}:R> (<t:${dir1}:f>)\nHosted by : <@${host}>\nEntries : **${entries.length}**\nWinners: **${winners}**`)
.setColor(`#5865f2`)
.setTimestamp(dir2)
            await interaction.message.edit({embeds:[embed]})
            return interaction.editReply({content:`**تم دخولك في الجيف اواي بنجاح!**` , ephemeral:true})
        } else if(entries.includes(`<@${interaction.user.id}>`)) {
            entries = entries.filter(en => en != `<@${interaction.user.id}>`)
            giveaway.entries = entries;
            await allDB.set(`giveaways_${interaction.guild.id}` , giveaways)
            const embed = new EmbedBuilder()
.setTitle(`**${prize}**`)
.setDescription(`Ends : <t:${dir1}:R> (<t:${dir1}:f>)\nHosted by : <@${host}>\nEntries : **${entries.length}**\nWinners: **${winners}**`)
.setColor(`#5865f2`)
.setTimestamp(dir2)
            await interaction.message.edit({embeds:[embed]})
            return interaction.editReply({content:`**تم خروجك من الجيف اواي بنجاح!**` , ephemeral:true})

        }
    }
    }
})
}