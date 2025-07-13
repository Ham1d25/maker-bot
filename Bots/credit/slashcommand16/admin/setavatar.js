const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setavatar')
        .setDescription('تغيير شكل البوت')
        .addStringOption(option =>
            option.setName('avatar')
                .setDescription('رابط الصورة')
                .setRequired(true)),
    async execute(interaction) {
        // التحقق من وجود صلاحية ADMINISTRATOR
        if (!interaction.guild || !interaction.member.permissions.has('ADMINISTRATOR')) {
            return interaction.reply({ content: 'لا تمتلك الصلاحيات الكافية.', ephemeral: true });
        }

        // استخلاص رابط الصورة من الأمر
        const avatarURL = interaction.options.getString('avatar');

        // تغيير شكل البوت
        try {
            await interaction.client.user.setAvatar(avatarURL);
            await interaction.reply({ content: 'تم تغيير شكل البوت بنجاح.', ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'حدث خطأ أثناء تغيير شكل البوت.', ephemeral: true });
        }
    },
};