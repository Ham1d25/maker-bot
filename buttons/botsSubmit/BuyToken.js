const { Client, Collection, Partials, MessageEmbed } = require("discord.js");
const { Database } = require("st.db");
const setting = new Database("/database/settingsdata/setting");
const usersdata = new Database(`/database/usersdata/usersdata`);
const prices = new Database("/database/settingsdata/prices");
const tier1subscriptions = new Database("/database/makers/tier1/subscriptions");
const moment = require("moment");
const fs = require("fs");

const path = require("path");
const { readdirSync } = require("fs");

module.exports = {
  name: "interactionCreate",
  async execute(interaction) {
    // التحقق مباشرة من customId للزر
    if (interaction.isButton() && interaction.customId === "yes") {
      // تنفيذ الإجراءات مباشرة بدون تأجيل الرد الفوري
      await interaction.deferReply({ ephemeral: true });

      // قراءة الملف
      const filePath = path.join(__dirname, "tokengen.json");
      const data = fs.readFileSync(filePath, "utf-8");
      const tokens = JSON.parse(data).tokens;

      // التحقق من وجود مخزون للتوكنات
      if (tokens.length === 0) {
        interaction.editReply("**عفوًا، لقد انتهى مخزون التوكنات. يرجى الانتظار حتى يتم إضافة مخزون جديد.**");
        return;
      }

      // اختيار توكن عشوائي
      const randomIndex = Math.floor(Math.random() * tokens.length);
      const selectedToken = tokens[randomIndex];

      // تحديث رصيد المستخدم
      let userbalance = parseInt(usersdata.get(`balance_${interaction.user.id}_${interaction.guild.id}`));
      if (userbalance < 2) {
        interaction.editReply("**عذرًا، رصيدك غير كاف لشراء التوكن.**");
        return;
      }

      // التحقق من عدد العمليات السابقة التي تمت في الـ 15 دقيقة الأخيرة
      const currentTime = moment();
      const lastThreePurchases = usersdata.get(`last_three_purchases_${interaction.user.id}_${interaction.guild.id}`) || [];
      const validPurchases = lastThreePurchases.filter(time => currentTime.diff(moment(time), 'minutes') < 15);

      if (validPurchases.length >= 3) {
        interaction.editReply("**عذرًا، يمكنك شراء 3 توكنات كحد أقصى كل 15 دقيقة.**");
        return;
      }

      // خصم 2 من رصيد المستخدم
      userbalance -= 2;
      // تحديث رصيد المستخدم في قاعدة البيانات
      usersdata.set(`balance_${interaction.user.id}_${interaction.guild.id}`, userbalance);

      // إرسال التوكن في رسالة خاصة
      const user = await interaction.user.fetch();
      const embed = {
        title: "تم شراء توكن بوت بنجاح",
        description: `**token:** \n **\`\`\`${selectedToken.token}\`\`\`**`
      };

      user.send({ embeds: [embed] })
        .then(() => interaction.editReply("**تم شراء التوكن بنجاح. الرجاء التحقق من الرسائل الخاصة.**"))
        .catch((error) => {
          console.error(error);
          interaction.editReply("**حدث خطأ أثناء إرسال الرسالة في الخاص. الرجاء التحقق من إعدادات الخصوصية والمحاولة مرة أخرى.**");
        });

      // حذف التوكن من الملف
      tokens.splice(randomIndex, 1);
      const updatedData = { tokens };
      fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2));

      // تحديث وقت الشراء الأخير
      const lastThreePurchasesUpdated = [...lastThreePurchases, currentTime.toISOString()];
      usersdata.set(`last_three_purchases_${interaction.user.id}_${interaction.guild.id}`, lastThreePurchasesUpdated);

      // إرسال إشعار بالشراء في القناة
      const purchasedBy = interaction.member.displayName;
      const channelId = "1206700477266264155"; // Replace with your desired channel ID
      const channel = interaction.guild.channels.cache.get(channelId);
      if (channel) {
        const purchaseMessage = `__Token__ has been purchased by ${interaction.user}`;
        channel.send(purchaseMessage)
          .catch(error => console.error("Error sending purchase notification:", error));
      } else {
        console.error("Channel not found.");
      }
    }
  }
};
