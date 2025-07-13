const { Events, Interaction, EmbedBuilder } = require("discord.js");
const { Database } = require("st.db");

const usersdata = new Database(`/database/usersdata/usersdata`);

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (interaction.isButton()) {
      if (interaction.customId == "showMyBots") {
        // التحقق من وجود خيارات الأمر والخيار "user"
        const userOption = interaction.options && interaction.options.getUser("user");
        
        // استخدام interaction.user إذا لم يتم تحديد خيار "user"
        const user = userOption || interaction.user;

        let userbalance = usersdata.get(`balance_${user.id}_${interaction.guild.id}`) ?? 0;
        let userbots = usersdata.get(`bots_${user.id}_${interaction.guild.id}`) ?? 0;
        let usersub = usersdata.get(`sub_${user.id}`);
        let userstatus = usersub ? "مشترك" : "غير مشترك";

        // إنشاء EmbedBuilder
        const embedBuilder = new EmbedBuilder()
          .setColor("#f6f6f6")
          .setTitle("معلومات الحساب")
     .setDescription(`**:moneybag: Balance: \`${userbalance}\` عملة. \n\n :star: Subscription: \`${userstatus}\`.  \n\n :robot: Bots: \`${userbots}\` بوت. **`);

        // إرسال الرد بشكل جذاب للمتفاعل فقط
        interaction.reply({ embeds: [embedBuilder], ephemeral: true });
      }
    }
  },
};
