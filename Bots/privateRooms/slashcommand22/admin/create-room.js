const { Client, Collection, ChannelType, SlashCommandBuilder, GatewayIntentBits, Partials, EmbedBuilder, ApplicationCommandOptionType, Events, ActionRowBuilder, ButtonBuilder, ButtonStyle, Message, Embed, PermissionsBitField } = require("discord.js");
const { Database } = require("st.db");
const db = new Database("/Json-db/Bots/privateRoomsDB.json");
const rooms = new Database("/Json-db/Bots/privateRoomsDB.json");
const ms = require('ms');
const moment = require('moment');

module.exports = {
    ownersOnly: true,
    data: new SlashCommandBuilder()
        .setName('create-room')
        .setDescription('انشاء روم لشخص')
        .addStringOption(option => option
            .setName('roomname')
            .setDescription('اسم الروم')
            .setRequired(true))
        .addUserOption(option => option
            .setName('roomowner')
            .setDescription('صاحب الروم')
            .setRequired(true)),
    async execute(interaction, client) {
        const roomowner = interaction.options.getUser('roomowner');
        const roomname = interaction.options.getString('roomname');

        // Check if the user has administrator permissions
        if (!interaction.member.permissionsIn(interaction.channel).has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ ephemeral: true, content: '**انت لا تمتلك ادمن ستريتور**' });
        }

        // Check if all required settings are in the database
        const requiredSettings = ['recipient', 'category', 'roomprice', 'renewprice', 'role'];
        for (const setting of requiredSettings) {
            if (!db.has(`${setting}_${interaction.guild.id}`)) {
                return interaction.reply({ content: `**الرجاء تحديد جميع الاعدادات قبل استخدام الامر**` });
            }
        }

        const roleid = await db.get(`role_${interaction.guild.id}`);
        const category = await db.get(`category_${interaction.guild.id}`);

        // Check if the role and category exist
        const theRole = interaction.guild.roles.cache.get(roleid);
        const theCategory = interaction.guild.channels.cache.get(category);
        if (!theRole || !theCategory) {
            return interaction.reply({ content: '**الدور أو الفئة غير موجودة**' });
        }

        try {
            const theRoom = await interaction.guild.channels.create({
                name: roomname,
                parent: category,
                type: ChannelType.GuildText,
                rateLimitPerUser: 60 * 30, // 30 minutes slow mode
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: [
                            PermissionsBitField.Flags.AttachFiles,
                            PermissionsBitField.Flags.EmbedLinks,
                            PermissionsBitField.Flags.SendMessages,
                            PermissionsBitField.Flags.MentionEveryone
                        ],
                    },
                    {
                        id: roomowner.id,
                        allow: [
                            PermissionsBitField.Flags.AttachFiles,
                            PermissionsBitField.Flags.EmbedLinks,
                            PermissionsBitField.Flags.SendMessages,
                            PermissionsBitField.Flags.MentionEveryone
                        ],
                    },
                ]
            });

            await rooms.push(`rooms_${interaction.guild.id}`, {
                roomowner: roomowner.id,
                roomname: roomname,
                roomid: theRoom.id,
                guildid: interaction.guild.id,
                timeleft: 60 * 60 * 24 * 7 // 7 days
            });

            const theMember = interaction.guild.members.cache.get(roomowner.id);
            await theMember.roles.add(theRole);

            const embed1 = new EmbedBuilder()
                .setColor('Yellow')
                .setTimestamp(Date.now() + ms('7d'))
                .addFields(
                    { name: '**صاحب الروم**', value: `${roomowner}`, inline: false },
                    { name: '**مدة الروم**', value: '**``7 أيام``**', inline: false },
                    { name: '**تاريخ بداية الروم**', value: `**\`\`\`${moment().format('YYYY-MM-DD')}\`\`\`**`, inline: false },
                    { name: '**تاريخ انتهاء الروم**', value: `**\`\`\`${moment().add(7, 'days').format('YYYY-MM-DD')}\`\`\`**`, inline: false },
                );

            await theRoom.send({ embeds: [embed1] });
            return interaction.reply({ content: '**تم بنجاح**' });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: '**حدث خطأ أثناء إنشاء الروم**' });
        }
    }
};