const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { Database } = require("st.db")
const selfDB = new Database("/Json-db/Bots/selfDB.json");

module.exports = {
    ownersOnly: true,
    data: new SlashCommandBuilder()
        .setName('set-roles')
        .setDescription('تحديد الرتب')
        .addRoleOption(option => option.setName('role1').setDescription('اختر الدور الأول'))
        .addRoleOption(option => option.setName('role2').setDescription('اختر الدور الثاني'))
        .addRoleOption(option => option.setName('role3').setDescription('اختر الدور الثالث'))
        .addRoleOption(option => option.setName('role4').setDescription('اختر الدور الرابع')),

    async execute(interaction) {
        try {
            const selectedRole1 = interaction.options.getRole('role1');
            const selectedRole2 = interaction.options.getRole('role2');
            const selectedRole3 = interaction.options.getRole('role3');
            const selectedRole4 = interaction.options.getRole('role4');

            if (!selectedRole1 || !selectedRole2 || !selectedRole3 || !selectedRole4) {
                return await interaction.reply('يرجى تحديد جميع الأدوار.');
            }

            await selfDB.set(`role1_${interaction.guildId}`, selectedRole1.id);
            await selfDB.set(`role2_${interaction.guildId}`, selectedRole2.id);
            await selfDB.set(`role3_${interaction.guildId}`, selectedRole3.id);
            await selfDB.set(`role4_${interaction.guildId}`, selectedRole4.id);

            await interaction.reply('**تم تحديد الاعدادات بنجاح.**');
        } catch (error) {
            console.error('**خطأ في تحديث الاعدادات:**', error);
            await interaction.reply('**حدث خطأ أثناء تحديث الاعادادت.**');
        }
    }
};