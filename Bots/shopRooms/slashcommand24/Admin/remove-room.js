const { SlashCommandBuilder, EmbedBuilder , TextInputBuilder ,TextInputStyle,ActionRowBuilder ,ModalBuilder ,PermissionsBitField } = require("discord.js");
const { Database } = require("st.db")
const db = new Database("/Json-db/Bots/shopRoomsDB.json")
module.exports = {
    ownersOnly:true,
    data: new SlashCommandBuilder()
    .setName('remove-room')
    .setDescription(`ازالة روم من نظام رومات الشوب`)
    .addStringOption(Option => Option
        .setName(`roomname`)
        .setDescription(`اسم الروم`)
        .setRequired(true))
       
                    , 
async execute(interaction) {

       let openhour = await db.get(`openhour_${interaction.guild.id}` )
       let openminute = await db.get(`openminute_${interaction.guild.id}` )
       let closehour = await db.get(`closehour_${interaction.guild.id}` )
      let closeminute =  await db.get(`closeminute_${interaction.guild.id}` )
       let logroom = await db.get(`logroom_${interaction.guild.id}` )
       let category = await db.get(`category_${interaction.guild.id}` )
        if(!openhour || !openminute || !closehour || !closeminute || !logroom || !category) return interaction.reply({content:`**قم بتحديد الاعدادات عن طريق امر السيتب اولا**`})
    let roomname = interaction.options.getString(`roomname`)
    if(!db.has(`rooms_${interaction.guild.id}`)) {
        await db.set(`rooms_${interaction.guild.id}` , [])
    }
    let rooms = await db.get(`rooms_${interaction.guild.id}`)
    let filtered = await rooms.filter(ro => ro.roomname != roomname)
    await db.set(`rooms_${interaction.guild.id}` , filtered)
        return interaction.reply({content:`**تم ازالة الروم بنجاح**`})
}
}