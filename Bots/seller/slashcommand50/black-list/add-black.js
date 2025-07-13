const { SlashCommandBuilder, EmbedBuilder , PermissionsBitField, ActionRowBuilder,ButtonBuilder,MessageComponentCollector,ButtonStyle } = require("discord.js");
const { Database } = require("st.db")
const db = new Database("/Json-db/Bots/sellerDB.json")

module.exports = {
    ownersOnly:true,
    data: new SlashCommandBuilder()
    .setName('add-user-blacklist')
    .setDescription('اضافة مستخدم لقائمة الحظر')
  .addUserOption(Option => Option
    .setName(`user`)
    .setDescription(`الشخص`)
    .setRequired(true)),
  
  async execute(interaction) {
    const userToAdd = interaction.options.getUser('user')

     db.push(`BannedUsers_${interaction.guild.id}`, userToAdd.id);

    interaction.reply({ content: `**تمت إضافة  <@${userToAdd.id}> إلى قائمة المحظورين.**`, ephemeral: true });
  }
};