const { SlashCommandBuilder, EmbedBuilder , TextInputBuilder ,TextInputStyle,ActionRowBuilder ,ModalBuilder ,PermissionsBitField } = require("discord.js");
const { Database } = require("st.db")
const db = new Database("/Json-db/Bots/shopDB.json")
module.exports = {
    ownersOnly:true,
    data: new SlashCommandBuilder()
    .setName('add-product-goods')
    .setDescription('اضافة سلع لمنتج معين'), 
async execute(interaction) {
    let products = db.get(`products_${interaction.guild.id}`)
    if(!products) return interaction.reply({content:`**لا يوجد منتجات لأضافة سلع اليها**`})
    if(products.length <= 0) return interaction.reply({content:`**لا يوجد منتجات لأضافة سلع اليها**`})
    const modal = new ModalBuilder()
    .setCustomId(`add_goods`)
    .setTitle(`Add Product Goods`)
    const type = new TextInputBuilder()
    .setCustomId(`type`)
    .setLabel(`Product Name`)
    .setStyle(TextInputStyle.Short)
    const code = new TextInputBuilder()
    .setCustomId(`Goods`)
    .setLabel(`Goods`)
    .setStyle(TextInputStyle.Paragraph)
    const row = new ActionRowBuilder().addComponents(type)
    const row2 = new ActionRowBuilder().addComponents(code)
    modal.addComponents(row,row2)
    await interaction.showModal(modal)
}
}