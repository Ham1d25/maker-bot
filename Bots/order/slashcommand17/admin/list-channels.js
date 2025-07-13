const { SlashCommandBuilder, EmbedBuilder , PermissionsBitField, ActionRowBuilder,ButtonBuilder,MessageComponentCollector,ButtonStyle } = require("discord.js");
const { Database } = require("st.db")
const db = new Database("/Json-db/Bots/orderDB.json")

module.exports = {
    ownersOnly:true,
    data: new SlashCommandBuilder()
    .setName('list-channel')
    .setDescription('روئية شانل العروض بالسيرفر'),
  
    async execute(interaction) {
    const channel = await db.get(`order_rooms_${interaction.guild.id}`) || [];
    const channelMentions = channel.map(channelId => `<#${channelId}>`);

    if (channelMentions.length === 0) {
      return interaction.reply({ content: '**لا يوجد أي شانل عروض حالياً.**', ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setTitle('قائمة شانل العروض')
      .setDescription(channelMentions.join('\n'))
      .setColor('#000000');

    interaction.reply({ embeds: [embed]});
  }
};