const { SlashCommandBuilder,Events , ActivityType,ModalBuilder,TextInputStyle, EmbedBuilder , PermissionsBitField,ButtonStyle, TextInputBuilder, ActionRowBuilder,ButtonBuilder,MessageComponentCollector } = require("discord.js")
const { Database } = require("st.db")
const setting = new Database("/database/settingsdata/setting");
const usersdata = new Database(`/database/usersdata/usersdata`);
const prices = new Database("/database/settingsdata/prices");
const {mainguild} = require('../../config.json')
const tier3subscriptions = new Database("/database/makers/tier3/subscriptions")
;module.exports = {
  name: Events.InteractionCreate,
  /**
   * @param {Interaction} interaction
  */
  async execute(interaction){
    if (interaction.isStringSelectMenu()) {
        if(interaction.customId == 'select_bot') {
          let selected = interaction.values[0]
          if(selected == "changeActive") {

          const modal = new ModalBuilder()
            .setCustomId('changeActive_Modal')
            .setTitle('Set status');
          
          const Bot_token = new TextInputBuilder()
            .setCustomId('Bot_token')
            .setLabel("توكن البوت")
            .setStyle(TextInputStyle.Short)
            .setMinLength(1)
            .setMaxLength(90);

             const set_active = new TextInputBuilder()
            .setCustomId('set_active')
            .setLabel("حالة البوت الجديدة online/idle/dnd")
            .setStyle(TextInputStyle.Short)
            .setMinLength(1)
            .setMaxLength(90);
          
          const firstActionRow = new ActionRowBuilder().addComponents(Bot_token);
          const firstActionRow2 = new ActionRowBuilder().addComponents(set_active);
          

          modal.addComponents(firstActionRow, firstActionRow2);
          
          await interaction.showModal(modal)
     }
      }
    }
  }
};