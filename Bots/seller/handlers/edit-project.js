const { SlashCommandBuilder,Events,StringSelectMenuBuilder ,Client, ActivityType,ModalBuilder,TextInputStyle, EmbedBuilder , PermissionsBitField,ButtonStyle, TextInputBuilder, ActionRowBuilder,ButtonBuilder,MessageComponentCollector } = require("discord.js");
const { Database } = require("st.db");
const db = new Database("/Json-db/Bots/sellerDB.json")
module.exports = (client50) => {
    client50.on(Events.InteractionCreate , async(interaction) =>{
    if (!interaction.isModalSubmit()) return;
  
    if (interaction.customId === 'updateProduct') {
    
      const oldName = interaction.fields.getTextInputValue('oldName');
      const newName = interaction.fields.getTextInputValue('newName');
      const newPrice = interaction.fields.getTextInputValue('newPrice');
      const newLink = interaction.fields.getTextInputValue('newLink');
  
      const foundProducts = await db.get(`Products_${interaction.guild.id}`, { productName: oldName });
  
      let theProductName;
      if (Array.isArray(foundProducts) && foundProducts.length > 0) {
            
        const selectedProduct = foundProducts.find(product => product.productName === oldName);
        if (selectedProduct) {
          theProductName = selectedProduct.productName;
        } else {
          return interaction.reply({ content: `** قم بإدخال إسم منتج صحيح**`, ephemeral: true });
        }
      }
  
      if(isNaN(newPrice)) return interaction.reply({ content: `**قم إدخال سعر المنتج بطريقة صحيحة.**`, ephemeral:true });
  
      const checkData = await db.get(`Products_${interaction.guild.id}`);
      const removingProduct = checkData.filter(re => re.productName !== theProductName);
      await db.set(`Products_${interaction.guild.id}`, removingProduct);
  
      await db.push(`Products_${interaction.guild.id}`, {
        productName: newName,
        productPrice: newPrice,
        productLink: newLink
      });
  
      interaction.reply({ content: `** تم تعديل المنتج بنجاح**` });
  
    }
  })};