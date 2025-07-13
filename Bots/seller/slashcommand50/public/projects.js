const { SlashCommandBuilder, EmbedBuilder , PermissionsBitField, ActionRowBuilder,ButtonBuilder,MessageComponentCollector,ButtonStyle } = require("discord.js");
const { Database } = require("st.db")
const db = new Database("/Json-db/Bots/sellerDB.json")

module.exports = {
    ownersOnly:false,
    data: new SlashCommandBuilder()
    .setName('بروجكتات')
    .setDescription('لروئية البروجكتات باسعارها'),
  
  async execute(interaction) { 
    const products = await db.get(`Products_${interaction.guild.id}`);
    if (!products || products.length === 0) {
      return interaction.reply({ content: `**لا توجد بيانات متاحة حالياً.**`, ephemeral: true });
    } else {
      let response = '**بروجكتات متاحة :**\n';
      products.forEach(product => {
        response += `- **الاسم : ${product.productName}** \n- **السعر : ${product.productPrice}** \n`;
      });
      return interaction.reply({ content: response, ephemeral: true });
    }
  }
}