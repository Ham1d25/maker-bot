const { SlashCommandBuilder, EmbedBuilder,Events ,TextInputStyle,TextInputBuilder ,ModalBuilder,PermissionsBitField, ActionRowBuilder,ButtonBuilder,MessageComponentCollector,ButtonStyle } = require("discord.js");
const { Database } = require("st.db");
const usersdata = new Database(`/database/usersdata/usersdata`)
;module.exports = {
    name: Events.InteractionCreate,
    /**
     * @param {Interaction} interaction
    */
    async execute(interaction){
    if(interaction.isModalSubmit()) {
        if(interaction.customId == 'give') {
            await interaction.deferReply({ephemeral:true})
let user = interaction.fields.getTextInputValue(`user`) ?? interaction.user
let quantity = interaction.fields.getTextInputValue(`coins`)
let userbalance = usersdata.get(`balance_${user}_${interaction.guild.id}`);
if(!userbalance) {
   await usersdata.set(`balance_${user}_${interaction.guild.id}` , quantity)
}else {
    let newuserbalance = parseInt(userbalance) + parseInt(quantity)
    await usersdata.set(`balance_${user}_${interaction.guild.id}` , newuserbalance)
}
userbalance = usersdata.get(`balance_${user}_${interaction.guild.id}`)
let balanceembed = new EmbedBuilder()
.setDescription(`**تم اعطاء <@${user}> الرصيد بنجاح\nرصيده الحالي هو : \`${userbalance}\`**`)
.setColor(`Gold`)
.setTimestamp()
return interaction.editReply({embeds:[balanceembed]})
    }
}
}
}