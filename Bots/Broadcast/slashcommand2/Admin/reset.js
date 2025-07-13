const { SlashCommandBuilder } = require("discord.js");
const { Database } = require("st.db");

const db = new Database("/Json-db/Bots/BroadcastDB");
const { theowner } = require('../../Broadcast-Bots');

module.exports = {
    ownersOnly: true,
    data: new SlashCommandBuilder()
        .setName('reset')
        .setDescription('لحذف التوكنات القديمة'),
    async execute(interaction) {
 // القيام بحذف البيانات
        try {
           
            const data = await db.get(`tokens_${interaction.guild.id}`);

            if (!data || !data.length) {
                return await interaction.reply('**لا توجد توكنات لحذفها.**');
            }

            await db.delete(`tokens_${interaction.guild.id}`);
            await interaction.reply('**تم حذف التوكنات بنجاح.**');
        } catch (error) {
            console.error(error);
            await interaction.reply('**حدث خطأ أثناء محاولة حذف التوكنات.**');
        }
    },
};
