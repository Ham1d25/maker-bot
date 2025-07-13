const { SlashCommandBuilder,TextInputStyle,TextInputBuilder,ModalBuilder,Events, EmbedBuilder , PermissionsBitField, ActionRowBuilder,ButtonBuilder,MessageComponentCollector,ButtonStyle } = require("discord.js");
const { Database } = require("st.db");
const usersdata = new Database(`/database/usersdata/usersdata`)
const db = new Database("/database/usersdata/codes")
module.exports = {
  name: Events.InteractionCreate,
    /**
    * @param {Interaction} interaction
  */
  async execute(interaction){
    if(interaction.isButton()) {
        if(interaction.customId == "usecode") {
           
   
            const modal = new ModalBuilder()
            .setCustomId('usecode_Model')
			.setTitle('Use coupon');
            const code = new TextInputBuilder()
            .setCustomId('code')
            .setLabel("coupon")
            .setStyle(TextInputStyle.Short);
           
            const firstActionRow = new ActionRowBuilder().addComponents(code);
            modal.addComponents(firstActionRow)
            await interaction.showModal(modal)
        }
    }
}
};