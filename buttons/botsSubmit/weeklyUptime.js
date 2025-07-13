const { Client, Collection, discord,GatewayIntentBits, Partials , EmbedBuilder, ApplicationCommandOptionType , Events , ActionRowBuilder , ButtonBuilder ,MessageAttachment, ButtonStyle , Message } = require("discord.js");
const { Database } = require("st.db")
const setting = new Database("/database/settingsdata/setting");
const usersdata = new Database(`/database/usersdata/usersdata`);
const prices = new Database("/database/settingsdata/prices");
const invoices = new Database("/database/settingsdata/invoices");
const tokens = new Database("/tokens/tokens")
const tier1subscriptions = new Database("/database/makers/tier1/subscriptions")
const uptimeDB = new Database("/Json-db/Bots/uptimeDB.json")
const keepAlive = require('keep-alive')
const path = require('path');
const { readdirSync } = require("fs");
;module.exports = {
  name: Events.InteractionCreate,
  /**
   * @param {Interaction} interaction
  */
  async execute(interaction){
    if (interaction.isModalSubmit()) {
        if(interaction.customId == "BuyWeeklyUptime_Modal") {
            await interaction.deferReply({ephemeral:true})
            let userbalance = parseInt(usersdata.get(`balance_${interaction.user.id}_${interaction.guild.id}`))
            const weekly_uptime = interaction.fields.getTextInputValue(`weekly_uptime`)
            let uptimes = await uptimeDB.get(`uptimes`)
            if(!uptimes) await uptimeDB.set(`uptimes` , [])
            uptimes = await uptimeDB.get(`uptimes`)
        await uptimeDB.push(`uptimes` , 
        {
            url:weekly_uptime,
            type:`weekly`,
            guildId:interaction.guild.id,
            userId:interaction.user.id,
            timeLeft:60 * 60 * 24 * 7,
        });
        function generateRandomCode() {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let code = '';
            for (let i = 0; i < 12; i++) {
              if (i > 0 && i % 4 === 0) {
                code += '-';
              }
              const randomIndex = Math.floor(Math.random() * characters.length);
              code += characters.charAt(randomIndex);
            }
            return code;
        }
        const invoice = generateRandomCode();
        await invoices.set(`${invoice}_${interaction.guild.id}` , 
                    {
                        type:`ابتايم اسبوعي`,
                        token:`${weekly_uptime}`,
                        prefix:`لا يوجد`,
                        userid:`${interaction.user.id}`,
                        guildid:`${interaction.guild.id}`,
                        serverid:`عام`,
                    price:35
                });
                let doneembeduser = new EmbedBuilder()
                .setTitle(`**تم شراء ابتايم بنجاح**`)
                .setDescription(`**معلومات الفاتورة :**`)
                .addFields(
                    {
                        name:`**الفاتورة**`,value:`**\`${invoice}\`**`,inline:false
                    },
                    {
                        name:`**نوع الابتايم**`,value:`**\`اسبوعي\`**`,inline:false
                    },
                    {
                        name:`**رابط الابتايم**`,value:`**\`${weekly_uptime}\`**`,inline:false
                    })
                    await interaction.user.send({embeds:[doneembeduser]})
                    const newbalance = parseInt(userbalance) - parseInt(35)
                    await usersdata.set(`balance_${interaction.user.id}_${interaction.guild.id}` , newbalance)
                    let doneembedprove = new EmbedBuilder()
                    .setColor(`Gold`)
                    .setDescription(`**تم شراء \`ابتايم اسبوعي\` بواسطة : ${interaction.user}**`)
                    .setTimestamp()
                    let logroom =  setting.get(`log_room_${interaction.guild.id}`)
                    let theroom = interaction.guild.channels.cache.find(ch => ch.id == logroom)
                    await theroom.send({embeds:[doneembedprove]})
                    await interaction.editReply({content:`**تم انشاء الابتايم بنجاح وتم خصم \`${35}\` من رصيدك**`})
                    keepAlive.add(weekly_uptime, 1000 * 60 * 3);
                }
    }
}
};