const { SlashCommandBuilder, EmbedBuilder , PermissionsBitField, ActionRowBuilder,ButtonBuilder,MessageComponentCollector,ButtonStyle } = require("discord.js");
const { Database } = require("st.db")
const db = new Database("/Json-db/Bots/sellerDB.json")

module.exports = {
    ownersOnly:true,
    data: new SlashCommandBuilder()
    .setName('list-black')
    .setDescription('روئية الاشخاص المحظوريين بالسيرفر'),
  
    async execute(interaction) {
    const bannedUsers = await db.get(`BannedUsers_${interaction.guild.id}`) || [];
    const bannedUsersMentions = bannedUsers.map(userId => `<@${userId}>`);

    if (bannedUsersMentions.length === 0) {
      return interaction.reply({ content: '**لا يوجد أي شخص محظور حالياً.**', ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setTitle('قائمة الأشخاص المحظورين')
      .setDescription(bannedUsersMentions.join('\n'))
      .setColor('#000000');

    interaction.reply({ embeds: [embed]});
  }
};