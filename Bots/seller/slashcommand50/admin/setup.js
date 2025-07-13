const { SlashCommandBuilder, EmbedBuilder , PermissionsBitField, ActionRowBuilder,ButtonBuilder,MessageComponentCollector,ButtonStyle } = require("discord.js");
const { Database } = require("st.db")
const db = new Database("/Json-db/Bots/sellerDB.json")

module.exports = {
    ownersOnly:true,
    data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('اضافة روم الوج وتم الشراء')
  .addChannelOption(Option => Option
    .setName(`log-channel`)
    .setDescription(`روم تم الشراء`)
    .setRequired(false))
 .addChannelOption(Option => Option
    .setName(`transfer-room`)
    .setDescription(`روم التحويل`)
    .setRequired(false))
    .addRoleOption(Option => Option
        .setName(`customer`)
        .setDescription(`رول العميل`)
        .setRequired(false))
    .addStringOption(text => text
            .setName(`pannel-image`)
            .setDescription(`صورة البانل`)
            .setRequired(false)),
  
  async execute(interaction) {


    let transfer = interaction.options.getChannel('transfer-room');
    let log = interaction.options.getChannel('log-channel');
    let role = interaction.options.getRole('customer');
    let image = interaction.options.getString(`pannel-image`)
    if (log){
     db.set(`log_${interaction.guild.id}`, log.id)
    } 
    if(role){
    db.set(`role${interaction.guild.id}`, role.id)
    }
    if(transfer){
    db.set(`transferroom_${interaction.guild.id}`,transfer.id)
}
 if (image){
     db.set(`image_${interaction.guild.id}`,image)
  }

interaction.reply({ content: `**تم إضافة الاعدادات بنجاح**`, ephemeral:true  });
    
  }
}