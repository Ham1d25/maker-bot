const { SlashCommandBuilder, EmbedBuilder , TextInputBuilder ,TextInputStyle,ActionRowBuilder ,ModalBuilder ,PermissionsBitField } = require("discord.js");
const { Database } = require("st.db")
const db = new Database("/Json-db/Bots/shopRoomsDB.json")
module.exports = {
    ownersOnly:true,
    data: new SlashCommandBuilder()
    .setName('add-room')
    .setDescription(`اضافة روم الى نظام رومات الشوب`)
    .addStringOption(Option => Option
        .setName(`roomname`)
        .setDescription(`اسم الروم`)
        .setRequired(true))
        .addRoleOption(Option => Option
            .setName(`role1`)
            .setDescription(`رول يمكنها الكتابة في الروم`)
            .setRequired(false))
            .addRoleOption(Option => Option
                .setName(`role2`)
                .setDescription(`رول يمكنها الكتابة في الروم`)
                .setRequired(false))
                .addRoleOption(Option => Option
                    .setName(`role3`)
                    .setDescription(`رول يمكنها الكتابة في الروم`)
                    .setRequired(false))
                    .addRoleOption(Option => Option
                        .setName(`role4`)
                        .setDescription(`رول يمكنها الكتابة في الروم`)
                        .setRequired(false))
                        .addRoleOption(Option => Option
                            .setName(`role5`)
                            .setDescription(`رول يمكنها الكتابة في الروم`)
                            .setRequired(false))
                            .addRoleOption(Option => Option
                                .setName(`role6`)
                                .setDescription(`رول يمكنها الكتابة في الروم`)
                                .setRequired(false))
                                .addRoleOption(Option => Option
                                    .setName(`role7`)
                                    .setDescription(`رول يمكنها الكتابة في الروم`)
                                    .setRequired(false))
                                    .addRoleOption(Option => Option
                                        .setName(`role8`)
                                        .setDescription(`رول يمكنها الكتابة في الروم`)
                                        .setRequired(false))
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
    let role1 = interaction.options.getRole(`role1`)
    let role2 = interaction.options.getRole(`role2`)
    let role3 = interaction.options.getRole(`role3`)
    let role4 = interaction.options.getRole(`role4`)
    let role5 = interaction.options.getRole(`role5`)
    let role6 = interaction.options.getRole(`role6`)
    let role7 = interaction.options.getRole(`role7`)
    let role8 = interaction.options.getRole(`role8`)
    if(!db.has(`rooms_${interaction.guild.id}`)) {
        await db.set(`rooms_${interaction.guild.id}` , [])
    }
    let settings = {roomname:roomname , permissionRoles:[]}
        if(role1) {
            await settings.permissionRoles.push(role1.id)
        }
        if(role2) {
            await settings.permissionRoles.push(role2.id)
        }
        if(role3) {
            await settings.permissionRoles.push(role3.id)
        }
        if(role4) {
            await  settings.permissionRoles.push(role4.id)
        }
        if(role5) {
            await  settings.permissionRoles.push(role5.id)
        }
        if(role6) {
            await  settings.permissionRoles.push(role6.id)
        }
        if(role7) {
            await  settings.permissionRoles.push(role7.id)
        }
        if(role8) {
           await settings.permissionRoles.push(role8.id)
        }
        await db.push(`rooms_${interaction.guild.id}` ,settings)
        return interaction.reply({content:`**تم اضافة الروم مع صلاحيات الرولات بنجاح**`})
}
}