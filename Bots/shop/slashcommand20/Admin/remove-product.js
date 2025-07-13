const { SlashCommandBuilder, EmbedBuilder , PermissionsBitField } = require("discord.js");
const { Database } = require("st.db")
const db = new Database("/Json-db/Bots/shopDB.json")
module.exports = {
    ownersOnly:true,
    data: new SlashCommandBuilder()
    .setName('remove-product')
    .setDescription('ازالة نوع من المنتجات من للبيع')
    .addStringOption(Option => Option
        .setName(`name`)
        .setDescription(`اسم المنتج`)
        .setRequired(true))
    ,
async execute(interaction) {
    await interaction.deferReply({ephemeral:false})
    const name = interaction.options.getString(`name`)
    const price = interaction.options.getString(`price`)
       let products = await db.get(`products_${interaction.guild.id}`)
       if(!products) {
        await db.set(`products_${interaction.guild.id}` , [])
        products = await db.get(`products_${interaction.guild.id}`)
       }
       let testFind = await products.find(ah => ah.name == name)
       if(!testFind) return interaction.editReply({content:`**هذا المنتج غير متوفر للأزالة**`})
       let filtered = await products.filter(cha => cha.name != name)
    await db.set(`products_${interaction.guild.id}` , filtered)
    await interaction.editReply({content:`**تم ازالة المنتج بنجاح**`})
}
}