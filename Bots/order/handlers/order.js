const { SlashCommandBuilder,Events ,Client, ActivityType,ModalBuilder,TextInputStyle, EmbedBuilder , PermissionsBitField,ButtonStyle, TextInputBuilder, ActionRowBuilder,ButtonBuilder,MessageComponentCollector } = require("discord.js");
const { Database } = require("st.db");
const orderDB = new Database("/Json-db/Bots/orderDB.json")
module.exports = (client17) => {
  client17.on(Events.InteractionCreate , async(interaction) =>{
    if(interaction.isButton()) {
        if(interaction.customId == "order") {
            let Category = orderDB.get(`category_${interaction.guild.id}`)
            let role = orderDB.get(`role_${interaction.guild.id}`)
            let Wellcome = orderDB.get(`wellcome_${interaction.guild.id}`) ?? `اهلان بك في تكت طلب المنتج برجاء انتظار <@&${role}>`
            let theticket = await interaction.guild.channels.create({
                name:`ticket-${interaction.user.tag}`,
                parent:Category,
                permissionOverwrites:[
                    {
                        id:interaction.guild.id,
                        deny:[PermissionsBitField.Flags.ViewChannel],
                    },
                    {
                        id:interaction.user.id,
                        allow:[PermissionsBitField.Flags.ViewChannel , PermissionsBitField.Flags.SendMessages],
                    },
                    {
                        id:role,
                        allow:[PermissionsBitField.Flags.ViewChannel , PermissionsBitField.Flags.SendMessages],
                    }
                ]
            })
             interaction.reply({content:`The Ticket Has Been Created ${theticket}`, ephemeral:true})
            let openembed = new EmbedBuilder()
        .setFooter({text:interaction.user.username , iconURL:interaction.user.displayAvatarURL({dynamic:true})})
        .setAuthor({name:interaction.guild.name , iconURL:interaction.guild.iconURL({dynamic:true})})
        .setTimestamp(Date.now())
        .setColor('#00f3ff')
        .setTitle(`${Wellcome}`)
        const deleteticket = new ButtonBuilder()
        .setCustomId(`delete_ticket`)
        .setLabel(`Delete Ticket`)
        .setEmoji("❌")
        .setStyle(ButtonStyle.Danger)
        const row = new ActionRowBuilder()
        .addComponents(deleteticket);
        await theticket.send({components:[row] , embeds:[openembed] , content:`**${interaction.user} , <@&${role}>**`})
        }
    }
  }
  )};