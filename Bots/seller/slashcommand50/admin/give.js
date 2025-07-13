const { SlashCommandBuilder, EmbedBuilder , PermissionsBitField, ActionRowBuilder,ButtonBuilder,MessageComponentCollector,ButtonStyle } = require("discord.js");
const { Database } = require("st.db")
const db = new Database("/Json-db/Bots/sellerDB.json")

module.exports = {
    ownersOnly:true,
    data: new SlashCommandBuilder()
    .setName('give')
    .setDescription('اعطاء بروجكت')
  .addUserOption(Option => Option
    .setName(`user`)
    .setDescription(`الشخص`)
    .setRequired(true))
.addStringOption(text => text
    .setName(`project-name`)
    .setDescription(`اسم البروجكت`)
    .setRequired(true))
,
  
  async execute(client, interaction) {
    const recipient = interaction.options.getUser('user');
    const selectedProject = interaction.options.getString('project-name');
    
    const products = await db.get(`Products_${interaction.guild.id}`);
    const projectData = products.find(product => product.productName === selectedProject);

    if (!projectData) {
      return interaction.reply({ content: '**لا يمكن العثور على اسم البروجكت المحدد.**', ephemeral: true });
    }

    const projectLink = projectData.productLink;

    await recipient.send(`**تم منحك رابط للبروجكت: ${projectLink}**`);
    await interaction.reply({ content: `**✅ تم إرسال الرابط بنجاح لـ ${recipient}**` });
  }
};

async function getProjectChoices() {
  const projects = await db.get(`Products_${interaction.guild.id}`) || [];
  const choices = [];

  for (const project of projects) {
    choices.push({
      name: project.productName,
      value: project.productName
    });
  }

  return choices;
}
