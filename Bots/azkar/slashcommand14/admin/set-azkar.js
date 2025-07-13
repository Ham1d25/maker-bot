const { SlashCommandBuilder, EmbedBuilder ,ButtonStyle, PermissionsBitField, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const { Database } = require("st.db")
const azkar = new Database("/Json-db/Bots/azkarDB.json")
const db = new Database("/database/data")
const moment = require('moment');
const ms = require('ms')

module.exports = {
    ownersOnly: true,
    data: new SlashCommandBuilder()
        .setName('set-azkar-room')
        .setDescription('تعيين الغرفة لإرسال الأذكار إليها')
        .addChannelOption(option =>
            option.setName('room')
                .setDescription('الروم الذي تريد تعيينه لإرسال الأذكار إليه')
                .setRequired(true)),
    async execute(interaction) {
        const room = interaction.options.getChannel('room');
        const channelId = room.id;

        // قم بإضافة قيمة إيدي الروم إلى مصفوفة channelIds في الملف
        let channelIds = azkar.get("channelIds") || [];
        if (!channelIds.includes(channelId)) {
            channelIds.push(channelId);
            azkar.set("channelIds", channelIds);

            interaction.reply(`**تم تعيين الروم بنجاح.**`);

            // قم بتحديث البيانات داخل الذاكرة
            channelIds = azkar.get("channelIds");
        } else {
            interaction.reply('هذا الروم معين بالفعل لإرسال الأذكار إليه.');
        }
    },
};