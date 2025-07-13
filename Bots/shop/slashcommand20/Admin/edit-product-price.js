const { SlashCommandBuilder, EmbedBuilder , PermissionsBitField } = require("discord.js");
const { Database } = require("st.db")
const db = new Database("/Json-db/Bots/shopDB.json")
module.exports = {
    data: new SlashCommandBuilder()
    .setName(`edit-product-price`)
    .setDescription(`تعديل سعر منتج`)
    .addStringOption(Option => Option
        .setName(`name`)
        .setDescription(`اسم المنتج`)
        .setRequired(true))
        .addIntegerOption(Option => Option
            .setName(`newprice`)
            .setDescription(`السعر الجديد`)
            .setRequired(true))
    ,
async execute(interaction) {
    await interaction.deferReply({ephemeral:false})
    let name = interaction.options.getString(`name`)
    let newprice = interaction.options.getInteger(`newprice`)
    let products = db.get(`products_${interaction.guild.id}`)
    if(!products) return interaction.editReply({content:`**لا يوجد منتج بهذا لاسم لتعديل السعر**`})
    if(products.length <= 0) return interaction.editReply({content:`**لا يوجد منتج بهذا الاسم لتعديل السعر**`})
    let productFind = products.find(pro => pro.name == name)
    if(!productFind) return interaction.editReply({content:`**لا يوجد منتج بهذا الاسم لتعديل السعر**`})
    productFind.price = newprice;
await db.set(`products_${interaction.guild.id}` , products)
return interaction.editReply({content:`**تم تحديد السعر الجديد بنجاح**`})
}
}