const { SlashCommandBuilder, EmbedBuilder , PermissionsBitField } = require("discord.js");
const { Database } = require("st.db")
const db = new Database("/Json-db/Bots/shopDB.json")
module.exports = {
    ownersOnly:true,
    data: new SlashCommandBuilder()
    .setName('add-product')
    .setDescription('اضافة نوع من المنتجات للبيع')
    .addStringOption(Option => Option
        .setName(`name`)
        .setDescription(`اسم المنتج`)
        .setRequired(true))
        .addIntegerOption(Option => Option
            .setName(`price`)
            .setDescription(`سعر المنتج`)
            .setRequired(true))
    ,
async execute(interaction) {
    await interaction.deferReply({ephemeral:false})
    const name = interaction.options.getString(`name`)
    const price = interaction.options.getInteger(`price`)
       let products = await db.get(`products_${interaction.guild.id}`)
       if(!products) {
           await db.set(`products_${interaction.guild.id}` , [])
           products = await db.get(`products_${interaction.guild.id}`)
        }

        let testFind = await products.find(ah => ah.name == name)
        if(testFind) return interaction.editReply({content:`**هذا المنتج متوفر بالفعل**`})
        await db.push(`products_${interaction.guild.id}` , {name:`${name}`,price:`${price}`,goods:[]})
    await interaction.editReply({content:`**تم اضافة المنتج بنجاح**`})
}
}