const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { Database } = require("st.db");

const db = new Database("/database/data");
const setting = new Database("/database/settingsdata/setting");
const image = new Database("/database/settingsdata/image");
const { owner } = require('../../config.json');

module.exports = {
    ownersOnly: true,
    data: new SlashCommandBuilder()
        .setName('send-dashboard')
        .setDescription(`Send dashboard panel`),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const dashboard = await setting.get(`dashboard_${interaction.guild.id}`);
        const message5 = await setting.get(`message3_${interaction.guild.id}`);

        if (!dashboard || !message5) {
            return interaction.editReply({ content: `**لم يتم تحديد الاعدادات**` });
        }

        const theroom = interaction.guild.channels.cache.get(dashboard);

        if (!theroom) {
            return interaction.editReply({ content: `**القناة غير موجودة**` });
        }

        const embed = new EmbedBuilder()
            .setTitle(`**Maker Simple Dashboard**`)
            .setDescription(`${message5}`)
            .setThumbnail(interaction.guild.iconURL())
            .setColor('#6586DB')
            .setTimestamp();

        const select = new StringSelectMenuBuilder()
            .setCustomId('select_bot')
            .setPlaceholder('Make a selection 🦾')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('Set status')
                    .setDescription('تعين حالة البوت')
                    .setEmoji('📊')
                    .setValue('changeActive'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('اﻋـادۃ ۛتــعــيــيــن')
                    .setDescription('̨ﻋــمــل اﻋـادۃ ۛتــعــيــيــن لــلاخــتــيــار')
                    .setEmoji('🔧')
                    .setValue('Reset_Selected'),
            );

        const row = new ActionRowBuilder().addComponents(select);


                const free1 = new ButtonBuilder()
                    .setCustomId(`showMyBots`)
                    .setLabel('Show my info')
                    .setStyle(ButtonStyle.Primary);

              const free2 = new ButtonBuilder() 
              .setCustomId(`ownerch`) 
              .setLabel('Change Owner') 
              .setStyle(ButtonStyle.Primary);      

                const usecode = new ButtonBuilder()
                    .setCustomId('usecode')
                    .setLabel('Redeem')
                    .setStyle(ButtonStyle.Danger);

                const row2 = new ActionRowBuilder().addComponents(free1,free2,usecode);

                theroom.send({ embeds: [embed], components: [row, row2] });
                return interaction.editReply({ content: `**تم ارسال الرسالة بنجاح**` });
            }
        };
