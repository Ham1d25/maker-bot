const { Client, GatewayIntentBits } = require("discord.js");
const { Database } = require("st.db");

module.exports = {
  name: "interactionCreate",
  async execute(interaction) {
    if (interaction.isModalSubmit()) {
      if (interaction.customId === "changeActive_Modal") {
        // Defer the reply before performing actions
        await interaction.deferReply({ ephemeral: true });

        // Fetch values submitted in the modal
        const Bot_token = interaction.fields.getTextInputValue(`Bot_token`);
        const set_active = interaction.fields.getTextInputValue(`set_active`);

        try {
          // Create a new Client instance with the provided token and intents
          const newClient = new Client({
            intents: [
              GatewayIntentBits.Guilds,
              GatewayIntentBits.GuildMessages,
              // Add any other intents your bot needs for the new client
            ],
          });

          await newClient.login(Bot_token);

        
newClient.login(Bot_token).then(() => {
  // تغيير حالة البوت بعد اتصاله
  newClient.user.setPresence({
    activities: [{
      name: set_active,
      type: 'WATCHING' // يمكنك تغيير هذا الجزء وفقًا للنوع المناسب
    }],
    status: set_active // يمكنك تغيير حالة البوت إلى أي حالة ترغب فيها مثل 'online' أو 'idle' أو 'dnd'
  });
}).catch(error => {
  console.error(error);
  // يمكنك إضافة إجراءات إضافية هنا في حالة حدوث خطأ أثناء تسجيل الدخول
});
          
        
          // Optionally, you may want to keep a reference to the newClient for further actions
          // ...

          await interaction.followUp("**تم تغير حالة البوت بنجاح**");

          // No need to log out of the new bot
        } catch (error) {
          console.error(error);
          await interaction.followUp("**عفوا لقد حدث خطأ الرجاء التأكد من التوكن.**");
        }
      }
    }
  }
};
