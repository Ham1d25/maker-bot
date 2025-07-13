const { SlashCommandBuilder, EmbedBuilder , PermissionsBitField, ActionRowBuilder,ButtonBuilder,MessageComponentCollector,ButtonStyle } = require("discord.js");
const { Database } = require("st.db")
const db = new Database("/Json-db/Bots/sellerDB.json")

module.exports = {
    ownersOnly:true,
    data: new SlashCommandBuilder()
    .setName('remove-order-channel')
    .setDescription('ازالة شانل عروض')
    .addChannelOption(Option => Option
      .setName(`order-channel`)
      .setDescription(`شانل العروض`)
      .setRequired(true)),
  
  async execute(interaction) {
    const channelsR = interaction.options.getUser('order-channel')
    const channels = await db.get(`order_rooms_${interaction.guild.id}`) || [];
    const index = channels.indexOf(channelsR.id);
    if (index !== -1) {
      channels.splice(index, 1);
      await db.set(`order_rooms_${interaction.guild.id}`, channels);
      interaction.reply({ content: `**تمت إزالة <#${channelsR.id}>من شانل العروض.**`, ephemeral: true });
    } else {
      interaction.reply({ content: `**<#${channelsR.id}> لم يتم إضافته إلى شانل العروض من قبل.**`, ephemeral: true });
    }
  }
};