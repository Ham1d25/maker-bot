const { SlashCommandBuilder, EmbedBuilder,TextInputBuilder,ModalBuilder , PermissionsBitField,TextInputStyle, ActionRowBuilder,ButtonBuilder,MessageComponentCollector,ButtonStyle } = require("discord.js");
const { Database } = require("st.db")
const db = new Database("/Json-db/Bots/sellerDB.json")

module.exports = {
    ownersOnly:true,
    data: new SlashCommandBuilder()
    .setName('edit')
    .setDescription('تعديل بروجكت'),
  
  async execute(interaction) {
    const modal = new ModalBuilder()
		  .setCustomId('updateProduct')
		  .setTitle('تعديل البروجكت');

    const oldProductName = new TextInputBuilder()
		  .setCustomId('oldName') .setLabel('قم بإدخال الإسم القديم للبروجكت') .setRequired(true) .setStyle(TextInputStyle.Short);

	  const newProductName = new TextInputBuilder()
		  .setCustomId('newName') .setLabel('قم بإدخال الإسم الجديد للبروجكت') .setRequired(true) .setStyle(TextInputStyle.Short);

    const newProductPrice = new TextInputBuilder()
		  .setCustomId('newPrice') .setLabel('قم بإدخال السعر الجديد للبروجكت') .setRequired(true) .setStyle(TextInputStyle.Short);

    const newProductLink = new TextInputBuilder()
		  .setCustomId('newLink') .setLabel('قم بإدخال الرابط الجديد للبروجكت') .setRequired(true) .setStyle(TextInputStyle.Short);

    const oldName = new ActionRowBuilder().addComponents(oldProductName);
    const newName = new ActionRowBuilder().addComponents(newProductName);
    const newPrice = new ActionRowBuilder().addComponents(newProductPrice);
    const newLink = new ActionRowBuilder().addComponents(newProductLink);

	  modal.addComponents(oldName, newName, newPrice, newLink);
	  await interaction.showModal(modal);
    
  }
}