const { SlashCommandBuilder, EmbedBuilder , PermissionsBitField, ActionRowBuilder,ButtonBuilder,MessageComponentCollector,ButtonStyle } = require("discord.js");
const { Database } = require("st.db")
const db = new Database("/Json-db/Bots/orderDB.json")
const { ChannelType } = require("discord-api-types/v9");
module.exports = {
    ownersOnly:true,
    data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('تصطيب نظام الاوردر')
  .addRoleOption(Option => Option
    .setName(`role-support`)
    .setDescription(`الرتبة`)
    .setRequired(false))

.addChannelOption(Option => Option
    .setName(`order-channel`)
    .setDescription(`شانل العروض`)
    .setRequired(false))

 .addAttachmentOption(Option => Option
    .setName(`order-line`)
    .setDescription(`لنك الاوردر`)
    .setRequired(false))

    .addStringOption(text => text
    .setName(`order-wellcome`)
    .setDescription(`رسالة الترحيب في التكت`)
    .setRequired(false))

    .addChannelOption(Option => Option
      .addChannelTypes(ChannelType.GuildCategory)
      .setName(`ticket-category`)
      .setDescription(`كتاجوري فتح التكت`)
      .setRequired(false)),
  
  async execute(interaction) {
    await interaction.deferReply({ephemeral:true})

    let roleSupport = interaction.options.getRole('role-support');
    let orderChannel = interaction.options.getChannel('order-channel');
    let orderLink = interaction.options.getAttachment('order-line');
    let wellcome = interaction.options.getString('order-wellcome');
    let category = interaction.options.getChannel('ticket-category');
    if(roleSupport) {
        await db.set(`role_${interaction.guild.id}` , roleSupport.id)
        }
    if(orderChannel) {
        await db.push(`order_rooms_${interaction.guild.id}` , orderChannel.id)
        }
    if(orderLink) {
            await db.set(`line_${interaction.guild.id}` , orderLink.url)
        }
        if(wellcome) {
          await db.set(`wellcome_${interaction.guild.id}` , wellcome)
      }
      if(category) {
        await db.set(`category_${interaction.guild.id}` , category.id)
    }



        if(!roleSupport && !orderChannel && ! orderLink && !wellcome && !category) return interaction.editReply({content:`**الرجاء تحديد اعداد واحد على الاقل**`}) 
        return interaction.editReply({content:`**تم تحديد الاعدادات بنجاح**`}) 
  }
}