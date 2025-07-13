const { SlashCommandBuilder, EmbedBuilder , PermissionsBitField, ActionRowBuilder,ButtonBuilder,MessageComponentCollector,ButtonStyle } = require("discord.js");
const { Database } = require("st.db");

const usersdata = new Database(`/database/usersdata/usersdata`)
module.exports ={
    ownersOnly:false,
    data: new SlashCommandBuilder()
    .setName('my-coins')
    .setDescription('See your coins or user coins')
    .addUserOption(Option => Option
        .setName(`user`)
        .setDescription(`الشخص`)
        .setRequired(false)),
    async execute(interaction, client) {
        await interaction.deferReply({ephemeral:false})
        const user = interaction.options.getUser(`user`) ?? interaction.user
        let userbalance = usersdata.get(`balance_${user.id}_${interaction.guild.id}`) ?? 0;
        let balanceembed = new EmbedBuilder()
        .setDescription(`**رصيد ${user} الحالي هو : \`${userbalance}\`**`)
        .setColor("#6586db")
        .setTimestamp()
        return interaction.editReply({embeds:[balanceembed]})
 
    }
}