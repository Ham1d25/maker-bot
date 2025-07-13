const { SlashCommandBuilder, EmbedBuilder , TextInputBuilder ,TextInputStyle,ActionRowBuilder ,ModalBuilder ,PermissionsBitField } = require("discord.js");
const { Database } = require("st.db")
const db = new Database("/Json-db/Bots/shopRoomsDB.json")
module.exports = {
    ownersOnly:true,
    data: new SlashCommandBuilder()
    .setName('delete-rooms')
    .setDescription(`حذف رومات الشوب`)
                    , 
async execute(interaction) {

       let openhour = await db.get(`openhour_${interaction.guild.id}` )
       let openminute = await db.get(`openminute_${interaction.guild.id}` )
       let closehour = await db.get(`closehour_${interaction.guild.id}` )
      let closeminute =  await db.get(`closeminute_${interaction.guild.id}` )
       let logroom = await db.get(`logroom_${interaction.guild.id}` )
       let category = await db.get(`category_${interaction.guild.id}` )
        if(!openhour || !openminute || !closehour || !closeminute || !logroom || !category) return interaction.reply({content:`**قم بتحديد الاعدادات عن طريق امر السيتب اولا**`})
        if(!db.has(`rooms_${interaction.guild.id}`)) {
            await db.set(`rooms_${interaction.guild.id}` , [])
        }
        let rooms = await db.get(`rooms_${interaction.guild.id}`)
        if(!rooms || rooms.length <= 0) return interaction.reply({content:`**لا يوجد رومات للحذف**`})
        await interaction.deferReply({ephemeral:false})

    rooms.forEach(async(room) => {
        
        let theChannel = await interaction.guild.channels.cache.find(ch => ch.name == room.roomname)
        try{
            theChannel.delete()
        }catch{
            setTimeout(() => {
                theChannel.delete()
            }, 1000);
        }
            
        })

  await interaction.editReply({content:`**تم حذف الرومات بنجاح**`})
    
}
}