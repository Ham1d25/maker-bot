const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder,ActionRowBuilder } = require("discord.js");
const { Database } = require("st.db");
const prices = new Database("/database/settingsdata/prices");
const setting = new Database("/database/settingsdata/setting");
module.exports = {
  ownersOnly:false,
 data : new SlashCommandBuilder()
  .setName('buy-coins')
  .setDescription('Buy coins.')
  .addIntegerOption(option => option
      .setName('amount')
      .setDescription('The amount of coins to purchase.')
      .setRequired(true)),

 async execute(interaction){
  await interaction.deferReply({ephemeral:true})
  const probot = await setting.get(`probot_${interaction.guild.id}`);
  const coinsprice = await prices.get(`coinsprice_price_${interaction.guild.id}`) || 1000;
  let panelroom = await setting.get(`log_room_${interaction.guild.id}`)
  const owner = await setting.get(`recipient_${interaction.guild.id}`);

  const amount = interaction.options.getInteger('amount');

  let price = Math.floor((coinsprice * amount) * (20 / 19) + 1);

  const creditChannel = interaction.guild.channels.cache.find(ch => ch.id == panelroom);
  const creditEmbed = new EmbedBuilder()
    .setTitle('Coins Buy')
    .setDescription(`**\`\`\`#credit ${owner} ${price} ${amount} Coins\`\`\`\n- Remaining Time: ${getTimeLeft(60)}**`)
    .setColor('#f6f6f6');
    

  const reply =  interaction.editReply({ embeds: [creditEmbed], ephemeral:true} );

  // Update Embed description every second
  const interval = setInterval(() => {
    const timeLeft = Math.max(0, Math.ceil((reply.createdAt.getTimeLeft() + 60000 - Date.now()) / 1000));
    creditEmbed.setDescription(`**\`\`\`#credit ${owner} ${price} ${amount}   Coins\`\`\`\n- Remaining Time: ${getTimeLeft(timeLeft)}**`);
     
    interaction.editReply({ embeds: [creditEmbed] }).catch(console.error);
  }, 1000);

  // Cancel purchase after 1 minute (60000 milliseconds)
  setTimeout(() => {
    clearInterval(interval);
    creditEmbed.setDescription('**\`Purchase failed\`**');
    interaction.editReply({ embeds: [creditEmbed] });
  }, 60000);

  let filter = (msg) => {
    if (msg.author.id === probot) {
      return msg.content === `**:moneybag: | ${interaction.user.username}, has transferred \`$${amount * coinsprice}\` to <@!${owner}> **`;
    }
  };
  const collector = interaction.channel.createMessageCollector({ filter, time: 60000 });

  collector.on('collect', async (msg) => {
    const usersdata = new Database('./database/usersdata/usersdata.json');
    let userbalance = usersdata.get(`balance_${interaction.user.id}_${interaction.guild.id}`) || 0;
    userbalance += amount;

    usersdata.set(`balance_${interaction.user.id}_${interaction.guild.id}`, userbalance);

    const purchaseEmbed = new EmbedBuilder()
      .setTitle('Coins Buy')
      .setDescription(`**Purchased coins: \`${amount}  Coins\`**`)
      .setColor('#f6f6f6');
     creditChannel.send({ embeds: [purchaseEmbed] });

    clearInterval(interval); // Stop countdown
    reply.delete(); // Delete the countdown embed

    collector.stop(); // Stop collecting messages
  });

}
}
function getTimeLeft(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}
