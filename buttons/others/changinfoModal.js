const { SlashCommandBuilder,TextInputStyle,TextInputBuilder,ModalBuilder,Events, EmbedBuilder , PermissionsBitField, ActionRowBuilder,ButtonBuilder,MessageComponentCollector,ButtonStyle } = require("discord.js");
const { Database } = require("st.db");
const setting = new Database("/database/settingsdata/setting")
module.exports = {
  name: Events.InteractionCreate,
    /**
    * @param {Interaction} interaction
  */
  async execute(interaction){
    if(interaction.isButton()) {
        if(interaction.customId == "Buyinfo") {

          const modal = new ModalBuilder()
            .setCustomId('changeInfo_Modal')
            .setTitle('Bot control');
          
          const Bot_token = new TextInputBuilder()
            .setCustomId('Bot_token')
            .setLabel("توكن البوت")
            .setStyle(TextInputStyle.Short)
            .setMinLength(1)
            .setMaxLength(90);
          
          const link_pic = new TextInputBuilder()
            .setCustomId('link_pic')
            .setLabel("رابط صورة البوت الجديدة")
            .setStyle(TextInputStyle.Short)
            .setMinLength(1)
            .setMaxLength(250);

             const new_name = new TextInputBuilder()
            .setCustomId('new_name')
            .setLabel("اسم البوت الجديد")
            .setStyle(TextInputStyle.Short)
            .setMinLength(1)
            .setMaxLength(30);
          
          const firstActionRow = new ActionRowBuilder().addComponents(Bot_token);
          const firstActionRow2 = new ActionRowBuilder().addComponents(link_pic);
          const firstActionRow3 = new ActionRowBuilder().addComponents(new_name);

          modal.addComponents(firstActionRow, firstActionRow2, firstActionRow3);
          
          await interaction.showModal(modal)
        }
    }
}
};