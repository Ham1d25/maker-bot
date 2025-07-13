const { SlashCommandBuilder, EmbedBuilder , PermissionsBitField, ActionRowBuilder,ButtonBuilder,MessageComponentCollector,ButtonStyle, Embed, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");

module.exports = {
    ownersOnly: true,
    data: new SlashCommandBuilder()
        .setName('send-panel-roles')
        .setDescription('ارسال بانل الرتب')
          .addChannelOption(option =>
            option.setName('target_channel')
                .setDescription('حدد الروم الذي سيتم فيه إرسال الإيمبد والأزرار')
                .setRequired(true)
)
        .addStringOption(option =>
            option.setName('first_button_label')
                .setDescription('أدخل اسم الزر الأول')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('second_button_label')
                .setDescription('أدخل اسم الزر الثاني')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('third_button_label')
                .setDescription('أدخل اسم الزر الثالث')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('fourth_button_label')
                .setDescription('أدخل اسم الزر الرابع')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('embed_title')
                .setDescription('أدخل عنوان الـ Embed')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('embed_content')
                .setDescription('أدخل محتوى الـ Embed')
                .setRequired(true)
        ),
    async execute(interaction) {
        const targetchannel = interaction.options.getChannel('target_channel');
        const firstButtonLabel = interaction.options.getString('first_button_label');
        const secondButtonLabel = interaction.options.getString('second_button_label');
        const thirdButtonLabel = interaction.options.getString('third_button_label');
        const fourthButtonLabel = interaction.options.getString('fourth_button_label');
        const embedTitle = interaction.options.getString('embed_title');
        const embedContent = interaction.options.getString('embed_content');


        let embed = new EmbedBuilder()
            .setTitle(embedTitle)
            .setDescription(embedContent)
            .setThumbnail(interaction.guild.iconURL())
            .setColor('#f6f6f6')
            .setThumbnail(interaction.guild.iconURL())
            .setTimestamp()
            .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL() });
 
        const prole1 = new ButtonBuilder()
            .setCustomId(`role1`)
            .setLabel(firstButtonLabel)
            .setStyle(ButtonStyle.Secondary);

        const prole2 = new ButtonBuilder()
            .setCustomId(`role2`)
            .setLabel(secondButtonLabel)
            .setStyle(ButtonStyle.Secondary);

        const prole3 = new ButtonBuilder()
            .setCustomId(`role3`)
            .setLabel(thirdButtonLabel)
            .setStyle(ButtonStyle.Secondary);

        const prole4 = new ButtonBuilder()
            .setCustomId(`role4`)
            .setLabel(fourthButtonLabel)
            .setStyle(ButtonStyle.Secondary);

        const row = new ActionRowBuilder()
            .addComponents(prole1, prole2, prole3, prole4);

        await targetchannel.send({ embeds: [embed], components:[row]});
        await interaction.reply({ ephemeral: true, content: '**تم ارسال الرسالة بنجاح**' });
    }
};

