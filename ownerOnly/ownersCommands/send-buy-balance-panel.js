const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonBuilder, MessageComponentCollector, ButtonStyle, Embed } = require("discord.js");
const { Database } = require("st.db")
const db = new Database("/database/data")
const { clientId, owner } = require('../../config.json');
const setting = new Database("/database/settingsdata/setting")

module.exports = {
    ownersOnly:true,
    data: new SlashCommandBuilder()
        .setName('send-balance-panel')
        .setDescription(`ارسال بانل شراء الرصيد`),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: false })
        let price1 = await setting.get(`balance_price_${interaction.guild.id}`) ?? 5000;
        let recipient = await setting.get(`recipient_${interaction.guild.id}`)
        let transferroom = await setting.get(`transfer_room_${interaction.guild.id}`)
        let logroom = await setting.get(`log_room_${interaction.guild.id}`)
        let probot = await setting.get(`probot_${interaction.guild.id}`)
        let clientrole = await setting.get(`client_role_${interaction.guild.id}`)
        let panelroom = await setting.get(`panel_room_${interaction.guild.id}`)
        let buybotroom = await setting.get(`buy_bot_room${interaction.guild.id}`)
        if (!price1 || !recipient || !transferroom || !logroom || !probot || !clientrole || !buybotroom) return interaction.editReply({ content: `**لم يتم تحديد الاعدادات**` })
        let theroom = interaction.guild.channels.cache.find(ch => ch.id == panelroom)
        let embed = new EmbedBuilder()
            .setDescription('Buy Coins 🪙')
            .setColor("Blue")
            .setDescription('1 Coins 🪙 = 1000')
            .setTimestamp()
        const free = new ButtonBuilder()
            .setCustomId(`BuyBalanceButton`)
            .setLabel('شراء عملات')
            .setEmoji('🪙')
            .setStyle(ButtonStyle.Secondary);
        const row = new ActionRowBuilder()
            .addComponents(free);
        theroom.send({ embeds: [embed], components: [row] })
       
        if (!owner.includes(interaction.user.id)) {
            return interaction.editReply({ content: `لا يمكنك استخدام هذا الامر !` })
        }
        return interaction.editReply({ content: `**تم ارسال الرسالة بنجاح**` })
    }
}
