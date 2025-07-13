
const { SlashCommandBuilder,Events , ActivityType,ModalBuilder,TextInputStyle, EmbedBuilder , PermissionsBitField,ButtonStyle, TextInputBuilder, ActionRowBuilder,ButtonBuilder,MessageComponentCollector } = require("discord.js")
const { Database } = require("st.db")

const tokens = new Database("/tokens/tokens");
const usersdata = new Database("/database/usersdata/usersdata");
const setting = new Database("/database/settingsdata/setting");
module.exports = {
  name: Events.InteractionCreate,
  /**
   * @param {Interaction} interaction
  */
   async execute(interaction){
    if(interaction.isButton()) {
        if(interaction.customId == "ownerch") {


          const modal = new ModalBuilder()
			.setCustomId('owner_Modal')
			.setTitle('My Modal');
          
         const clientId = new TextInputBuilder()
    .setCustomId('clientId')
    .setLabel("ايدي البوت")
    .setStyle(TextInputStyle.Short)
    .setMinLength(1)
    .setMaxLength(90);

const oldOwner = new TextInputBuilder()
    .setCustomId('oldowner')
    .setLabel("اونر القديم")
    .setStyle(TextInputStyle.Short)
    .setMinLength(1)
    .setMaxLength(90);

const newOwner = new TextInputBuilder()
    .setCustomId('newowner')
    .setLabel("اونر الجديد")
    .setStyle(TextInputStyle.Short)
    .setMinLength(1)
    .setMaxLength(90);

          
          const bot = new ActionRowBuilder().addComponents(clientId);
          const owner1 = new ActionRowBuilder().addComponents(oldOwner);
          const owner2 = new ActionRowBuilder().addComponents(newOwner);
          

          modal.addComponents(bot, owner1, owner2);
          
            await interaction.showModal(modal);
     }
      }
    }
  };