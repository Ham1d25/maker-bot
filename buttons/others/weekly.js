const { SlashCommandBuilder,Events, EmbedBuilder } = require("discord.js");
const { Database } = require("st.db");

const usersdata = new Database("/database/usersdata/usersdata");

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (interaction.isButton()) {
      if (interaction.customId == "weekly") {
        const userId = interaction.user.id;

    // التحقق مما إذا كان المستخدم قد استخدم الأسبوعيات هذا الأسبوع
    const lastWeeklyTimestamp = usersdata.get(`last_weekly_${userId}_${interaction.guild.id}`) || 0;
    const currentDate = new Date();

    // حساب الفرق بين الوقت الحالي وآخر مرة تم فيها استخدام الأمر بشكل صحيح
    const difference = currentDate.getTime() - lastWeeklyTimestamp;

    // التحقق من أنه لم يتم استخدام الأسبوعيات هذا الأسبوع
    if (difference >= 7 * 24 * 60 * 60 * 1000) { // 7 أيام بالمللي ثانية
      // إعطاء عدد عشوائي من 1 إلى 20
      const randomCoins = Math.floor(Math.random() * 5) + 1;

      // تحديث رصيد المستخدم
      const userBalance = usersdata.get(`balance_${userId}_${interaction.guild.id}`) || 0;
      const newUserBalance = userBalance + randomCoins;
      usersdata.set(`balance_${userId}_${interaction.guild.id}`, newUserBalance);

      // تحديث الوقت الأخير الذي تم فيه استخدام الأسبوعيات
      usersdata.set(`last_weekly_${userId}_${interaction.guild.id}`, currentDate.getTime());

      // إنشاء رد
      const embed = new EmbedBuilder()
        .setDescription(`**Congratulations 🎊 You Taked ${randomCoins} Your Balance Now : \`${newUserBalance}\`**`)
      
        .setColor(`#00FF00`)
        .setTimestamp();

      // إرسال رسالة في الروم
      interaction.reply({ embeds: [embed], ephemeral: true });

      // إرسال رسالة في الخاص
      const user = await interaction.client.users.fetch(userId);
      user.send(`**Congratulations 🎊 You Taked ${randomCoins} Your Balance Now : \`${newUserBalance}\`**`);
    } else {
      // إذا كان المستخدم قد استخدم الأسبوعيات هذا الأسبوع بالفعل
      const remainingTime = calculateRemainingTime(7 * 24 * 60 * 60 * 1000 - difference);
      return interaction.reply({
        content: `لقد استخدمت هذا الامر بالفعل هذا الأسبوع. يمكنك استخدام الأمر بعد ${remainingTime}.`,
        ephemeral: true,
      });
    }
   }
    }
}
}
function calculateRemainingTime(timeDifference) {
    const days = Math.floor(timeDifference / (24 * 60 * 60 * 1000));
    const hours = Math.floor((timeDifference % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const minutes = Math.floor((timeDifference % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((timeDifference % (60 * 1000)) / 1000);
  
    let remainingTime = "";
    
    if (days > 0) {
      remainingTime += `${days} يومًا و `;
    }
  
    if (hours > 0) {
      remainingTime += `${hours} ساعة و `;
    }
  
    if (minutes > 0) {
      remainingTime += `${minutes} دقيقة و `;
    }
  
    remainingTime += `${seconds} ثانية`;
  
    return remainingTime;
  }