const { SlashCommandBuilder,Events , ActivityType,ModalBuilder,TextInputStyle, EmbedBuilder , PermissionsBitField,ButtonStyle, TextInputBuilder, ActionRowBuilder,ButtonBuilder,MessageComponentCollector, Embed } = require("discord.js");
const settings = require("../../../database/settings")
const managers = require("../../../database/managers")
const { Database } = require("st.db")
const ticketsManager = new Database("/Json-db/Bots/ticketDB.json")
const sourcebin = require('sourcebin_js');
module.exports = (client7) => {
  client7.on(Events.InteractionCreate , async(interaction) =>{
    if(interaction.isButton()) {
      if(interaction.customId == "delete_ticket") {
            let deleteembed = new EmbedBuilder()
            .setTitle(`**سيتم حذف التكت بعد 5 ثواني**`)
            await interaction.reply({embeds:[deleteembed]})
            interaction.channel.messages.fetch().then(async(messages) => {
             let output = Array.from(messages.values()).reverse();
              output = output.map((m) => `${new Date(m.createdTimestamp).toLocaleString('en-US')} - ${m.author.tag}: ${m.attachments.size > 0 ? m.attachments.first().proxyURL : m.content}`).join('\n');
            })
            setTimeout(() => {
                return interaction.channel.delete();
            }, 5000);
        
      }
    }
  }
  )}