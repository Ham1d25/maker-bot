const { SlashCommandBuilder, EmbedBuilder , TextInputBuilder ,TextInputStyle,ActionRowBuilder ,ModalBuilder ,PermissionsBitField } = require("discord.js");
const { Database } = require("st.db")
const db = new Database("/Json-db/Bots/shopDB.json")
module.exports = {
    ownersOnly:true,
    data: new SlashCommandBuilder()
    .setName('remove-product-goods')
    .setDescription('ازالة سلع من منتج معين')
    .addStringOption(Option => Option
        .setName(`name`)
        .setDescription(`اسم المنتج`)
        .setRequired(true))
        .addStringOption(Option => Option
            .setName(`good`)
            .setDescription(`السلعة المراد ازالتها`)
            .setRequired(true)), 
async execute(interaction) {
   let name = interaction.options.getString(`name`)
   let good = interaction.options.getString(`good`)
   let products = await db.get(`products_${interaction.guild.id}`)
   if(!products) {
       await db.set(`products_${interaction.guild.id}` , [])
       products = await db.get(`products_${interaction.guild.id}`)
    }
    let testFind = await products.find(ah => ah.name == name)
    if(!testFind) return interaction.reply({content:`**هذا المنتج غير متوفر لازالة منه سلع**`})
    let goods = testFind.goods;
let goodFind = await goods.find(go => go == good)
    if(!goodFind) return interaction.reply({content:`**هذه السعة ليست متوفرة في هذا المنتج للازالة**`})
    let filtered = await goods.filter(goo => goo != good)

    testFind.goods = filtered
    await db.set(`products_${interaction.guild.id}` , products)
    return interaction.reply({content:`**تم ازالة السلعة بنجاح**` , ephemeral:true})

}
}