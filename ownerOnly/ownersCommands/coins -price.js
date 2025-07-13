const { SlashCommandBuilder, EmbedBuilder , PermissionsBitField, ActionRowBuilder,ButtonBuilder,MessageComponentCollector,ButtonStyle } = require("discord.js");
const { Database } = require("st.db")
const prices = new Database("/database/settingsdata/prices.json")
const { clientId,owner} = require('../../config.json');
module.exports = {
    ownersOnly:true,
    data: new SlashCommandBuilder()
    .setName('coins-price')
    .setDescription('Price changes')
    .addStringOption(Option => 
        Option
        .setName('bot-type')
        .setDescription('سعر الكوينز')
        .addChoices(
            {
                 name:`Coins` , value:`coinsprice`
         },
        
          )
        .setRequired(true))
        .addIntegerOption(Option => Option
            .setName(`price`)
            .setDescription(`السعر بالعملات`)
            .setRequired(true)), // or false
async execute(interaction) {
    await interaction.deferReply({ephemeral:false});
    const Bot_Type = interaction.options.getString(`bot-type`)
    const price = interaction.options.getInteger(`price`)
    if (Bot_Type === 'coinsprice' && price < 2000) {
        return interaction.editReply({ content: `عفواً، الحد الأدنى لسعر الكوينز هو 2000 كريدت.` });
    }
    const coinsprice = prices.set(`balance_price_${interaction.guild.id}` , price);
   await prices.set(`${Bot_Type}_price_${interaction.guild.id}` , price)
   return interaction.editReply({content:`**تم تغيير السعر بنجاح**`})
}
}