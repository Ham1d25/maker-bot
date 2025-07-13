const { Client, GatewayIntentBits } = require("discord.js");
const { Database } = require("st.db");

module.exports = {
  name: "interactionCreate",
  async execute(interaction) {
    if (interaction.isModalSubmit()) {
      if (interaction.customId === "changeInfo_Modal") {
        // Defer the reply before performing actions
        await interaction.deferReply({ ephemeral: true });

        // Fetch values submitted in the modal
        const Bot_token = interaction.fields.getTextInputValue(`Bot_token`);
        const link_pic = interaction.fields.getTextInputValue(`link_pic`);
        const new_name = interaction.fields.getTextInputValue(`new_name`);
       

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

  // Update bot's image
  await newClient.user.setAvatar(link_pic);

  // Wait for the image to be updated before changing the username
  await newClient.user.setAvatar(link_pic);

  // Update bot's name
  await newClient.user.setUsername(new_name);

          // Update bot information as needed
          // ...

          // Optionally, you may want to keep a reference to the newClient for further actions
          // ...

          await interaction.followUp("**تم تغير معلومات البوت بنجاح**");

          // Log out of the new bot
          await newClient.destroy();
        } catch (error) {
          console.error(error);
          await interaction.followUp("**عفوا لقد حدث خطأ الرجاء التأكد من المعلومات.**");
        }
      }
    }
  }
};
