const { Events, Interaction, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const { Database } = require("st.db");
const usersdata = new Database(`/database/usersdata/usersdata`);

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (interaction.isButton()) {
      if (interaction.customId == "buytokenyesno") {
        let userbalance;
        try {
          userbalance = parseInt(usersdata.get(`balance_${interaction.user.id}_${interaction.guild.id}`));
        } catch (error) {
          await interaction.reply({ content: "**عفوا رصيدك غير كافي.**", ephemeral: true });
          return;
        }
        
        // التحقق من رصيد المستخدم
        if (!userbalance || userbalance < 2) {
          await interaction.reply({ content: "**عفوا رصيدك غير كافي.**", ephemeral: true });
          return;
        }
        
        // بناء الإيمبد والأزرار إذا كان الرصيد كافيًا
        const embedBuilder = new EmbedBuilder()
          .setColor("#f6f6f6")
          .setTitle("تأكيد عملية شراء التوكن")
          .setDescription(`**سيتم خصم منك 2 عملات مقابل التوكن**`);

        const yes = new ButtonBuilder()
          .setCustomId(`yes`)
          .setLabel('Yes')
          .setStyle(ButtonStyle.Success);

        const no = new ButtonBuilder()
          .setCustomId(`no`)
          .setLabel('No')
          .setStyle(ButtonStyle.Danger);

        const row2 = new ActionRowBuilder()
          .addComponents(yes, no);

        // إرسال الرد بشكل جذاب للمتفاعل فقط
        await interaction.reply({ embeds: [embedBuilder], components: [row2], ephemeral: true });

        // تعريف مراقب للازرار
        const filter = i => i.user.id === interaction.user.id;

        // انتظر استجابة الزر للحذف
        const collector = interaction.channel.createMessageComponentCollector({
          filter,
          max: 1, // سنقوم بحذف الرد بمجرد الاستجابة الأولى فقط
          time: 15000 // اختياري: وقت الانتظار للرد (15 ثانية في هذا المثال)
        });

        collector.on('collect', async (button) => {
          // حذف الرسالة بمجرد الضغط على أي زر
          await interaction.deleteReply();
          // تنظيف المراقب بعد الاستجابة
          collector.stop();
        });
      }
    }
  },
};
