const { SlashCommandBuilder, EmbedBuilder , PermissionsBitField, ActionRowBuilder,ButtonBuilder,MessageComponentCollector,ButtonStyle } = require("discord.js");
const { Database } = require("st.db")
const db = new Database("/Json-db/Bots/sellerDB.json")

module.exports = {
    ownersOnly:true,
    data: new SlashCommandBuilder()
    .setName('bank')
    .setDescription('اضافة بروجكت')
  .addUserOption(Option => Option
    .setName(`bankid`)
    .setDescription(`اي دي البنك`)
    .setRequired(false))
.addUserOption(Option => Option
    .setName(`probotid`)
    .setDescription(`اي دي برو بوت`)
    .setRequired(false)),
  
  
  async execute(interaction) {

    const BankId = interaction.options.getUser('bankid');
    const ProBotId = interaction.options.getUser('probotid');
   if (BankId){
    db.set(`BankId_${interaction.guild.id}`, BankId.id)
  } if(ProBotId){
    db.set(`ProBotId_${interaction.guild.id}`, ProBotId.id)
  }

    interaction.reply({ content: `**تم تحديد حساب التحويل و البروبوت بنجاح**` });
    
  }
}