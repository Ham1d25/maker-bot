const { SlashCommandBuilder,Events ,Client, ActivityType,ModalBuilder,TextInputStyle, EmbedBuilder , PermissionsBitField,ButtonStyle, TextInputBuilder, ActionRowBuilder,ButtonBuilder,MessageComponentCollector } = require("discord.js");
const { Database } = require("st.db");
const allDB = new Database("/Json-db/Bots/allDB.json")
module.exports = (client33) => {
  client33.on(Events.InteractionCreate , async(interaction) =>{
    if(interaction.isButton()) {
        if(interaction.customId == "ok_button") {
            const themsg = interaction.message;
            if(allDB.has(`${themsg.id}_${interaction.user.id}_voted`)) return interaction.reply({content:`**لقد قمت بالتصويت مرة بالفعل**` , ephemeral:true})
            let oks = allDB.get(`${themsg.id}_ok`)
            let nos = allDB.get(`${themsg.id}_no`)
            oks = oks + 1
            const button1 = new ButtonBuilder()
    .setCustomId(`ok_button`)
    .setLabel(`${oks}`)
    .setEmoji("✅")
    .setStyle(ButtonStyle.Success)
    const button2 = new ButtonBuilder()
    .setCustomId(`no_button`)
    .setLabel(`${nos}`)
    .setEmoji("❌")
    .setStyle(ButtonStyle.Danger)
    const row = new ActionRowBuilder().addComponents(button1 , button2)
    await allDB.set(`${themsg.id}_ok` , oks)
    await interaction.reply({content:`**شكرا لتصويتك**` , ephemeral:true})
    await allDB.set(`${themsg.id}_${interaction.user.id}_voted` , true)
    return interaction.message.edit({components:[row]})
        }
        if(interaction.customId == "no_button") {
            const themsg = interaction.message;
        if(allDB.has(`${themsg.id}_${interaction.user.id}_voted`)) return interaction.reply({content:`**لقد قمت بالتصويت مرة بالفعل**` , ephemeral:true})
            let oks = allDB.get(`${themsg.id}_ok`)
            let nos = allDB.get(`${themsg.id}_no`)
            nos = nos + 1
            const button1 = new ButtonBuilder()
    .setCustomId(`ok_button`)
    .setLabel(`${oks}`)
    .setEmoji("✅")
    .setStyle(ButtonStyle.Success)
    const button2 = new ButtonBuilder()
    .setCustomId(`no_button`)
    .setLabel(`${nos}`)
    .setEmoji("❌")
    .setStyle(ButtonStyle.Danger)
    const row = new ActionRowBuilder().addComponents(button1 , button2)
    await allDB.set(`${themsg.id}_no` , nos)
    await interaction.reply({content:`**شكرا لتصويتك**` , ephemeral:true})
    await allDB.set(`${themsg.id}_${interaction.user.id}_voted` , true)
    return interaction.message.edit({components:[row]})
        }
    }
  }
  )};