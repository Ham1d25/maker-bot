const { SlashCommandBuilder, EmbedBuilder,StringSelectMenuBuilder ,StringSelectMenuOptionBuilder, PermissionsBitField, ActionRowBuilder,ButtonBuilder,MessageComponentCollector,ButtonStyle, Embed } = require("discord.js");
const { Database } = require("st.db")
module.exports ={
    data: new SlashCommandBuilder()
    .setName('play-quran')
    .setDescription('تشغيل قرأن'),
    async execute(interaction, client) {
        if(!interaction.member.voice.channel) return interaction.reply({content:`**يجب عليك ان تكون في روم صوتي**`})
        const select = new StringSelectMenuBuilder()
    .setCustomId('select_shei5')
    .setPlaceholder('اختيار القرأة بصوت ...')
    .addOptions(
        new StringSelectMenuOptionBuilder()
        .setLabel(`الشيخ مشاري راشد العفاسي`)
        .setDescription(`--`)
        .setEmoji(`📖`)
        .setValue(`https://www.youtube.com/watch?v=3ODvj9e4ktI&t=1s`),
        new StringSelectMenuOptionBuilder()
        .setLabel(`الشيخ سعد الغامدي`)
        .setDescription(`--`)
        .setEmoji(`📖`)
        .setValue(`https://www.youtube.com/watch?v=mlTEaDewo8g&t=26521s`),
        new StringSelectMenuOptionBuilder()
        .setLabel(`الشيخ ماهر المعيقلي`)
        .setDescription(`--`)
        .setEmoji(`📖`)
        .setValue(`https://www.youtube.com/watch?v=mQ70kbDmsKA&t=2s`),
        new StringSelectMenuOptionBuilder()
        .setLabel(`الشيخ ياسر الدوسري`)
        .setDescription(`--`)
        .setEmoji(`📖`)
        .setValue(`https://www.youtube.com/watch?v=VHVZaSxjV-Q&t=8s`),
        new StringSelectMenuOptionBuilder()
        .setLabel(`الشيخ عبد الباسط عبد الصمد`)
        .setDescription(`--`)
        .setEmoji(`📖`)
        .setValue(`https://www.youtube.com/watch?v=qc-SNASZWz4&t=11s`),
        new StringSelectMenuOptionBuilder()
        .setLabel(`الشيخ فارس عباد`)
        .setDescription(`--`)
        .setEmoji(`📖`)
        .setValue(`https://www.youtube.com/watch?v=y8b6LcpAICU`),
        new StringSelectMenuOptionBuilder()
        .setLabel(`الشيخ محمد صديق المنشاوي رحمه الله`)
        .setDescription(`--`)
        .setEmoji(`📖`)
        .setValue(`https://www.youtube.com/watch?v=L_DZWipt5hw&t=30099s`),
        new StringSelectMenuOptionBuilder()
        .setLabel(`الشيخ ناصر القطامي`)
        .setDescription(`--`)
        .setEmoji(`📖`)
        .setValue(`https://www.youtube.com/watch?v=_uVYDpin8fs`),
        new StringSelectMenuOptionBuilder()
        .setLabel(`الشيخ محمود خليل الحصري`)
        .setDescription(`--`)
        .setEmoji(`📖`)
        .setValue(`https://www.youtube.com/watch?v=LkGMu3RVcfg`),
        new StringSelectMenuOptionBuilder()
        .setLabel(`الشيخ علي الحذيفي`)
        .setDescription(`--`)
        .setEmoji(`📖`)
        .setValue(`https://www.youtube.com/watch?v=vVrE_B17X0g`),
        new StringSelectMenuOptionBuilder()
        .setLabel(`الشيخ محمد محمود الطبلاوي`)
        .setDescription(`--`)
        .setEmoji(`📖`)
        .setValue(`https://www.youtube.com/watch?v=CCZnDjPMRsk`),
        new StringSelectMenuOptionBuilder()
        .setLabel(`اعادة تعيين الاختيار`)
        .setDescription(`--`)
        .setEmoji(`📖`)
        .setValue(`reset_select`),
    )
        let row = new ActionRowBuilder().addComponents(select)
        await interaction.reply({components:[row]})
    }
}