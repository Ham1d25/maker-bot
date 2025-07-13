const { SlashCommandBuilder, EmbedBuilder , PermissionsBitField } = require("discord.js");
const { Database } = require("st.db")
const db = new Database("/Json-db/Bots/shopDB.json")
module.exports = {
    ownersOnly:false,
    data: new SlashCommandBuilder()
    .setName('buy')
    .setDescription('شراء سلعة')
    .addStringOption(Option => Option
        .setName(`product`)
        .setDescription(`اسم المنتج`)
        .setRequired(true))
        .addIntegerOption(Option => Option
            .setName(`count`)
            .setDescription(`الكمية`)
            .setRequired(true))
        , 
        async execute(interaction) {
            const name = interaction.options.getString(`product`)
            const count = interaction.options.getInteger(`count`)
    let products = db.get(`products_${interaction.guild.id}`)
    let testFind = await products.find(ah => ah.name == name)
    if(!testFind) return interaction.reply({content:`**هذا المنتج غير موجود**`})
    let goods = testFind.goods
    if(!goods || goods.length < count) return interaction.reply({content:`**العدد الذي تريد شرائه فوق قدر الكمية الموجودة\nالمتوفر حاليا : ${goods.length}**`})
    if(count > 10) return interaction.reply({content:`**لاسباب تتعلق ب مدى طول الرسالة لا يمكنك شراء اكثر من 10 في المرة الواحدة**`})   
    let price = parseInt(testFind.price)
        let price1 = parseInt(price * count)
        let price2 = Math.floor(price1 * (20/19) + 1)
        let recipient = db.get(`recipient_${interaction.guild.id}`)
        let clientrole = db.get(`clientrole_${interaction.guild.id}`)
        let probot = db.get(`probot_${interaction.guild.id}`)
        if(!recipient || !clientrole || !probot) return interaction.reply({content:`**لم يتم تحديد الاعدادات الرئيسية من قبل مالك البوت\nللتحديد يجب على مالك البوت استخدام هذا الامر :  \`/setup\`**`})
        let embed = new EmbedBuilder()
        .setDescription(`** قم بتحويل \`${price2}\` الى <@${recipient}> لأتمام عملية الشراء\n \`\`\`#credit ${recipient} ${price2}\`\`\`لديك 3 دقائق فقط للتحويل**`)
        .setTimestamp(Date.now() + 60 * 3 * 1000)
        .setFooter({text:interaction.user.username , iconURL:interaction.user.displayAvatarURL({dynamic:true})})
        .setAuthor({name:interaction.guild.name , iconURL:interaction.guild.iconURL({dynamic:true})})
       const transfermessage =  await interaction.reply({embeds:[embed]})
        const collectorFilter = m => (m.content.includes(price1) && (m.content.includes(recipient) || m.content.includes(`<@${recipient}>`)) && m.author.id == probot)
            const collector = await interaction.channel.createMessageCollector({
              filter:collectorFilter,
              max: 1,
              time: 1000 * 60 * 3
          });

         collector.on('collect' , async() => {
            function getRandomAndRemove(array, counter) {
                const result = [];
                for (let i = 0; i < counter; i++) {
                  const randomIndex = Math.floor(Math.random() * array.length);
                  const randomElement = array.splice(randomIndex, 1)[0];
                  result.push(randomElement);
                }
                return result;
              }
              const randomAndRemoved = getRandomAndRemove(goods, count);
              testFind.goods = goods
              await db.set(`products_${interaction.guild.id}` , products)
          let doneembed = new EmbedBuilder()
            .setTitle(`**تم الشراء بنجاح !**`)
            .setDescription(`**ستصلك المنتجات في الخاص**`)
            .setTimestamp()
            let goodsembed = new EmbedBuilder()
            .setTitle(`**تم الشراء بنجاح !**`)
            .setDescription(`**منتجاتك : **`)
            .setTimestamp()
            randomAndRemoved.forEach(async(removed) => {
                goodsembed.addFields(
                    {
                        name:`  `,value:`**\`\`\`${removed}\`\`\`**`,inline:false
                    }
                )
            })
            await interaction.channel.send({content:`${interaction.user}` , embeds:[doneembed]})
            await interaction.user.send({embeds:[goodsembed]})
            if(clientrole) {
              const therole = interaction.guild.roles.cache.find(ro => ro.id == clientrole)
              if(therole) {
                await interaction.guild.members.cache.get(interaction.user.id).roles.add(therole).catch(async() => {return;})
              }
            }

 
         })
         collector.on(`end` , async() => {
          try {
            transfermessage.delete().catch(async() => {return;})
          } catch (error) {
            return;
          }
         })
}
}