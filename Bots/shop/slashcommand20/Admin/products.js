const { SlashCommandBuilder, EmbedBuilder , PermissionsBitField } = require("discord.js");
const { Database } = require("st.db")
const db = new Database("/Json-db/Bots/shopDB.json")
module.exports = {
    data: new SlashCommandBuilder()
    .setName(`products`)
    .setDescription('رؤية المنتجات المتاحة للبيع')
    ,
async execute(interaction) {
    await interaction.deferReply({ephemeral:false})

       let products = await db.get(`products_${interaction.guild.id}`)
       if(!products) {
        await db.set(`products_${interaction.guild.id}` , [])
        products = await db.get(`products_${interaction.guild.id}`)
       }
       if(!products || products.length <= 0) return interaction.editReply({content:`**لا يوجد منتجات متوفرة الأن للبيع**`})
       let embed1 = new EmbedBuilder()
    .setTimestamp()
    .setTitle(`**جميع المنتجات المتوفرة للبـيع**`)
    .setFooter({text:interaction.user.username , iconURL:interaction.user.displayAvatarURL({dynamic:true})})
        .setAuthor({name:interaction.guild.name , iconURL:interaction.guild.iconURL({dynamic:true})})
        products.forEach(async(product) => {
            embed1.addFields(
                {
                    name:`**\`${product.name}\`**`,value:`**> السعر : \`${product.price}\`\n> الكمية المتاحة : \`${product.goods.length ?? 0}\`**`,inline:false
                }
            )
        })
        embed1.addFields({name:`  ` , value:`**\`/buy product:اسم المنتج\`**` , inline:false})
        await interaction.editReply({embeds:[embed1]})
}
}