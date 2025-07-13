const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");
const { Database } = require("st.db");
const db = new Database("/Json-db/Bots/sellerDB.json");

module.exports = {
    // تحديد أن الأمر متاح فقط للملاك
    ownersOnly: true,
    // تعريف الأمر باستخدام SlashCommandBuilder
    data: new SlashCommandBuilder()
        .setName('remove-member-blacklist')
        .setDescription('إزالة شخص من قائمة الحظر')
        .addUserOption(option => option
            .setName('user')
            .setDescription('اسم الشخص')
            .setRequired(true)),
  
    async execute(client, interaction) {
        // الحصول على المستخدم المحدد
        const userToRemove = interaction.options.getUser('user');

        // التحقق من صلاحيات المستخدم الذي يستدعي الأمر
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: 'ليس لديك الصلاحيات اللازمة لاستخدام هذا الأمر.', ephemeral: true });
        }

        // جلب قائمة المحظورين من قاعدة البيانات
        const bannedUsers = await db.get(`BannedUsers_${interaction.guild.id}`) || [];

        // التحقق مما إذا كان المستخدم موجودًا في القائمة
        const index = bannedUsers.indexOf(userToRemove.id);
        if (index !== -1) {
            // إزالة المستخدم من القائمة وتحديث قاعدة البيانات
            bannedUsers.splice(index, 1);
            await db.set(`BannedUsers_${interaction.guild.id}`, bannedUsers);

            // إرسال رد بالإزالة
            interaction.reply({ content: `**تمت إزالة <@${userToRemove.id}> من قائمة المحظورين.**`, ephemeral: true });
        } else {
            // إرسال رد بأن المستخدم غير موجود في القائمة
            interaction.reply({ content: `**<@${userToRemove.id}> لم يتم إضافته إلى قائمة المحظورين من قبل.**`, ephemeral: true });
        }
    }
};