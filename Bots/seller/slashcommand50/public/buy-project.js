const { SlashCommandBuilder, EmbedBuilder,StringSelectMenuBuilder , PermissionsBitField, ActionRowBuilder,ButtonBuilder,MessageComponentCollector,ButtonStyle } = require("discord.js");
const { Database } = require("st.db")
const db = new Database("/Json-db/Bots/sellerDB.json")

module.exports = {
    ownersOnly:false,
    data: new SlashCommandBuilder()
    .setName('buy-project')
    .setDescription('شراء بروجكت'),
  
  async execute(interaction) {
    const bannedUsers = db.get(`BannedUsers_${interaction.guild.id}`) ?? [];
    if (bannedUsers.includes(interaction.user.id)) {
      return interaction.reply({ content: '**لا يمكنك استخدام هذا الأمر لأنك في القائمة السوداء.**', ephemeral: true });
    }
    let products = await db.get(`Products_${interaction.guild.id}`);
    if (!products) return interaction.reply({ content: `**لا يوجد أي بروجكت حاليا**` });
    let image = await db.get(`image_${interaction.guild.id}`) ?? "https://media.discordapp.net/attachments/1202961848387764235/1203099981662134313/Sans_titre-1.png?ex=6636096c&is=6634b7ec&hm=53b08f3eff2f984d331da803c9abb417f92c75f1691d9080ac2b531e3237b945&=&format=webp&quality=lossless&width=759&height=427"
    const Embed = new EmbedBuilder()
      .setDescription(`**لرؤية البروجكتات الموجودة قم بفتح المنيو أسفل الرسالة**`)
      .setImage(`${image}`)
      .setFooter({ text : interaction.user.username , iconURL : interaction.user.displayAvatarURL()})
      .setThumbnail(interaction.guild.iconURL())
      .setColor('#000000')
    const Menu = new ActionRowBuilder()
      
    const productOptions = products.map((product, index) => ({
      label: product.productName,
      value: product.productName,
    }));

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('buyProduct')
      .setPlaceholder('إضغط هنا لاظهار البروجكتات')
      .addOptions(productOptions);
      
    Menu.addComponents(selectMenu);

    const messageProduct = await interaction.reply({ embeds: [Embed], components: [Menu],ephemeral: true });
    const filter = interaction => interaction.isMessageComponent() && interaction.customId === 'buyProduct' && interaction.user.id === interaction.user.id;
    const collector = interaction.channel.createMessageComponentCollector({ filter, maxComponents: 1, time: 60000 });
    collector.on('collect', async (interaction) => {

      if (interaction.customId === 'buyProduct') {
    const selectedProductId = interaction.values[0];

    const foundProducts = db.get(`Products_${interaction.guild.id}`, { productName: selectedProductId });

    let theProductPrice; let theProductLink;

    if (Array.isArray(foundProducts) && foundProducts.length > 0) {
      const selectedProduct = foundProducts.find(product => product.productName === selectedProductId);
      if (selectedProduct) {
        theProductPrice = selectedProduct.productPrice;
        theProductLink = selectedProduct.productLink;
      }
    }
  
    const productPrice = parseFloat(theProductPrice);
    const productPrice_Total = Math.floor(productPrice * (20 / 19) + 1);

    const BankId = await db.get(`BankId_${interaction.guild.id}`);
    const ProBotId = await db.get(`ProBotId_${interaction.guild.id}`);
    const transferroom = await db.get(`transferroom_${interaction.guild.id}`);
    await messageProduct.edit({ content: `**يجب عليك التحويل ف اسرع وقت**\n \`\`\`#credit ${BankId} ${productPrice_Total} \`\`\``, embeds:[], components: [],ephemeral: true });
    let transfersroom = await interaction.guild.channels.cache.find(ch => ch.id == transferroom)
    const filter = (m) => m.author.bot && m.author.id == `${ProBotId}` && m.content.includes(":moneybag:") && m.content.split("$").slice(-1)[0].split("`")[0] == `${productPrice}` && m.mentions.members.first().id == `${BankId}`;
    await   transfersroom.awaitMessages({ filter, max: 1, time: 300000, errors: ['time'] }).then(async (collected) => {

      interaction.user.send({ content: `**البروجكت : ${theProductLink} **` }).then(async m => {
        await messageProduct.edit({ content: `**تم إرسال البروجكت إلى خاصك بنجاح**`, embeds:[], components:[],ephemeral: true })
const roleID = db.get(`role_${interaction.guild.id}`)
const therole = interaction.guild.roles.cache.find(ro => ro.id == roleID)
        if (therole) {
          try {
            await interaction.guild.members.cache.get(interaction.user.id).roles.add(therole).catch(async() => {return;})
            console.log(`تم إضافة الرتبة بنجاح للمستخدم: ${interaction.user.tag}`);
          }catch (error) {
            console.error('حدث خطأ أثناء إضافة الرتبة:', error);
          }
        } else {
          console.error('لم يتم العثور على العضو في السيرفر.');
        }

const logChanne = db.get(`log_${interaction.guild.id}`);
let logChannel = await interaction.guild.channels.cache.find(ch => ch.id == logChanne)
        if (logChannel) {
          logChannel.send(`تم شراء ${selectedProductId} من قبل <@${interaction.user.id}>`);
        }          
      }).catch(async err => {
        return await messageProduct.edit({ content: `** خاصك مقفل لم أستطع إرسال البروجكت قم بالتواصل مع أحد الأونرز للحصول على البروجكت**`, embeds:[], components:[],ephemeral: true })
      });

    }).catch(async () => {
      await messageProduct.edit({ content: `**تم إلغاء العملية**`, embeds:[], components:[] ,ephemeral: true})          
    });

  }
});

collector.on('end', async (collected, reason) => {
  if (reason === 'time') {
    await messageProduct.edit({ content: `**تم إلغاء العملية**`, embeds:[], components:[] ,ephemeral: true});
  }
});

}
}