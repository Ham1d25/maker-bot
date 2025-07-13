const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setbotname')
        .setDescription('تغيير اسم البوت')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('الاسم الجديد للبوت')
                .setRequired(true)),
    async execute(interaction) {
        // التحقق من وجود صلاحية ADMINISTRATOR
        if (!interaction.guild || !interaction.member.permissions.has('ADMINISTRATOR')) {
            return interaction.reply({ content: 'لا تمتلك الصلاحيات الكافية.', ephemeral: true });
        }

        // استخلاص الاسم الجديد من الأمر
        const newName = interaction.options.getString('name');

        // تغيير اسم البوت
        try {
            await interaction.client.user.setUsername(newName);
            await interaction.reply({ content: `تم تغيير اسم البوت إلى ${newName} بنجاح.`, ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'حدث خطأ أثناء تغيير اسم البوت.', ephemeral: true });
        }
    },
};