const { SlashCommandBuilder, EmbedBuilder , PermissionsBitField, ActionRowBuilder,ButtonBuilder,MessageComponentCollector,ButtonStyle } = require("discord.js");
const { Database } = require("st.db")
const db = new Database("/Json-db/Bots/sellerDB.json")

module.exports = {
    ownersOnly:true,
    data: new SlashCommandBuilder()
    .setName('remove-project')
    .setDescription('ازالة بروجكت')
  .addStringOption(text => text
    .setName(`project-name`)
    .setDescription(`اسم البروجكت`)
    .setRequired(true)),
  
  
  async execute(client, interaction) {


    const productName = interaction.options.getString('project-name');

    const products = await db.get(`Products_${interaction.guild.id}`);

    const productToRemove = products.find(product => product.productName === productName);

    if (!productToRemove) return interaction.reply({ content: `**البروجكت غير موجود.**`, ephemeral: true });

    db.set(`Products_${interaction.guild.id}`, products.filter(product => product.productName !== productName));

    interaction.reply({ content: `**تم إزالة البروجكت بنجاح**` });
    
  }
}