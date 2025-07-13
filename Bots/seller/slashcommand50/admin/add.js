const { SlashCommandBuilder, EmbedBuilder , PermissionsBitField, ActionRowBuilder,ButtonBuilder,MessageComponentCollector,ButtonStyle } = require("discord.js");
const { Database } = require("st.db")
const db = new Database("/Json-db/Bots/sellerDB.json")

module.exports = {
    ownersOnly:true,
    data: new SlashCommandBuilder()
    .setName('add')
    .setDescription('اضافة بروجكت')
  .addStringOption(text => text
    .setName(`project-name`)
    .setDescription(`اسم البروجكت`)
    .setRequired(true))
.addStringOption(text => text
    .setName(`project-price`)
    .setDescription(`سعر البروجكت`)
    .setRequired(true))
 .addStringOption(text => text
    .setName(`project-line`)
    .setDescription(`لنك البروجكت`)
    .setRequired(true)),
  
  async execute(interaction) {


    const productName = interaction.options.getString('project-name');
    const productPrice = interaction.options.getString('project-price');
    const productLink = interaction.options.getString('project-line');

    if(isNaN(productPrice)) return interaction.reply({ content: `**قم إدخال سعر البروجكت بطريقة صحيحة.**`, ephemeral:true });

    db.push(`Products_${interaction.guild.id}`, {
      productName: productName,
      productPrice: productPrice,
      productLink: productLink
    });

    interaction.reply({ content: `**تم إضافة البروجكت بنجاح**`, ephemeral:true  });
    
  }
}