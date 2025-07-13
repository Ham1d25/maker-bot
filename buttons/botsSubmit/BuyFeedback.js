const { Client, Collection, discord,GatewayIntentBits, Partials , EmbedBuilder, ApplicationCommandOptionType , Events , ActionRowBuilder , ButtonBuilder ,MessageAttachment, ButtonStyle , Message } = require("discord.js");
const { Database } = require("st.db")
const setting = new Database("/database/settingsdata/setting");
const usersdata = new Database("/database/usersdata/usersdata");
const prices = new Database("/database/settingsdata/prices");
const invoices = new Database("/database/settingsdata/invoices");
const tokens = new Database("/tokens/tokens")
const tier1subscriptions = new Database("/database/makers/tier1/subscriptions")
const feedbackDB = new Database("/Json-db/Bots/feedbackDB.json")

let feedback = tokens.get("feedback")
const path = require('path');
const { readdirSync } = require("fs");
module.exports = {
  name: Events.InteractionCreate,
  /**
   * @param {Interaction} interaction
   */
  async execute(interaction) {
    if (interaction.isModalSubmit() && interaction.customId === "BuyFeedback_Modal") {
      await interaction.deferReply({ ephemeral: true });
      
      const Bot_token = interaction.fields.getTextInputValue(`Bot_token`);
      const Bot_prefix = interaction.fields.getTextInputValue(`Bot_prefix`);

      const client11 = new Client({
        intents: [
          GatewayIntentBits.Guilds,
          GatewayIntentBits.GuildMessageReactions,
          GatewayIntentBits.GuildMessages,
          GatewayIntentBits.GuildMessageTyping,
          GatewayIntentBits.MessageContent,
        ],
        shards: "auto",
        partials: [Partials.Message, Partials.Channel, Partials.GuildMember],
      });

      try {
        const owner = interaction.user.id;
        let price1 = prices.get(`feedback_price_${interaction.guild.id}`) || 15;
        price1 = parseInt(price1);

        function generateRandomCode() {
          const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
          let code = '';
          for (let i = 0; i < 12; i++) {
            if (i > 0 && i % 4 === 0) {
              code += '-';
            }
            const randomIndex = Math.floor(Math.random() * characters.length);
            code += characters.charAt(randomIndex);
          }
          return code;
        }

        const invoice = generateRandomCode();

        const rest = new REST({ version: '10' }).setToken(Bot_token);

        client11.on("ready", async () => {
          const doneembeduser = new EmbedBuilder()
            .setTitle(`**تم انشاء بوتك بنجاح**`)
            .setDescription(`**معلومات الفاتورة :**`)
            .addFields(
              { name: "**الفاتورة**", value: `**\`${invoice}\`**`, inline: false },
              { name: "**نوع البوت**", value: `**\`اراء\`**`, inline: false },
              { name: "**توكن البوت**", value: `**\`${Bot_token}\`**`, inline: false },
              { name: "**البريفكس**", value: `**\`${Bot_prefix}\`**`, inline: false }
            );

          await invoices.set(`${invoice}_${interaction.guild.id}`, {
            type: `اراء`,
            token: `${Bot_token}`,
            prefix: `${Bot_prefix}`,
            userid: `${interaction.user.id}`,
            guildid: `${interaction.guild.id}`,
            serverid: `عام`,
            price: price1,
          });

          const userbalance = parseInt(usersdata.get(`balance_${interaction.user.id}_${interaction.guild.id}`));
          const newbalance = userbalance - price1;
          await usersdata.set(`balance_${interaction.user.id}_${interaction.guild.id}`, newbalance);

          const thebut = new ButtonBuilder()
            .setLabel(`دعوة البوت`)
            .setStyle(ButtonStyle.Link)
            .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client11.user.id}&permissions=8&scope=bot%20applications.commands`);
          const rowss = new ActionRowBuilder().addComponents(thebut);

          await interaction.user.send({ embeds: [doneembeduser], components: [rowss] });
        });

        let doneembedprove = new EmbedBuilder()
          .setColor(`Gold`)
          .setDescription(`**تم شراء بوت \`اراء\` بواسطة : ${interaction.user}**`)
          .setTimestamp();

        const logroom = setting.get(`log_room_${interaction.guild.id}`);
        const theroom = interaction.guild.channels.cache.find(ch => ch.id == logroom);
        await theroom.send({ embeds: [doneembedprove] });

        let userbots = usersdata.get(`bots_${interaction.user.id}_${interaction.guild.id}`);
        if (!userbots) {
          await usersdata.set(`bots_${interaction.user.id}_${interaction.guild.id}`, 1);
        } else {
          userbots = userbots + 1;
          await usersdata.set(`bots_${interaction.user.id}_${interaction.guild.id}`, userbots);
        }

        await interaction.editReply({ content: `**تم انشاء بوتك بنجاح وتم خصم \`${price1}\` من رصيدك**` });

        client11.commands = new Collection();
        client11.events = new Collection();
        require("../../Bots/feedback/handlers/events")(client11);
        require("../../events/requireBots/feedback-commands")(client11);

        const folderPath = path.resolve(__dirname, '../../Bots/feedback/slashcommand11');
        const feedbackSlashCommands = [];
        for (let folder of readdirSync(folderPath).filter(folder => !folder.includes("."))) {
          for (let file of readdirSync(`${folderPath}/${folder}`).filter(f => f.endsWith(".js"))) {
            let command = require(`${folderPath}/${folder}/${file}`);
            feedbackSlashCommands.push(command.data.toJSON());
            client11.feedbackSlashCommands.set(command.data.name, command);
          }
        }

        const folderPath3 = path.resolve(__dirname, '../../Bots/feedback/handlers');
        for (let file of readdirSync(folderPath3).filter(f => f.endsWith('.js'))) {
          require(path.join(folderPath3, file))(client11);
        }

        client11.on("interactionCreate", async (interaction) => {
          if (interaction.isChatInputCommand()) {
            if (interaction.user.bot) return;
            
            const command = client11.feedbackSlashCommands.get(interaction.commandName);
            if (!command) {
              console.error(`No command matching ${interaction.commandName} was found.`);
              return;
            }

            if (command.ownersOnly && owner !== interaction.user.id) {
              return interaction.reply({ content: `❗ ***لا تستطيع استخدام هذا الامر***`, ephemeral: true });
            }

            try {
              await command.execute(interaction);
            } catch (error) {
              console.error(`Error executing ${interaction.commandName}`);
              console.error(error);
            }
          }
        });

        client11.on("messageCreate", async (message) => {
          if (message.author.bot || message.channel.type === 'dm') return;
          if (!message.content.startsWith(Bot_prefix)) return;

          const args = message.content.slice(Bot_prefix.length).trim().split(/ +/g);
          const cmd = args.shift().toLowerCase();
          if (cmd.length === 0) return;

          let command = client.commands.get(cmd) || client11.commands.get(client11.commandaliases.get(cmd));
          if (command) {
            if (command.ownersOnly && owner !== message.author.id) {
              return message.reply({ content: `❗ ***لا تستطيع استخدام هذا الامر***`, ephemeral: true });
            }

            if (command.cooldown) {
              if (cooldown.has(`${command.name}${message.author.id}`)) {
                const remainingTime = ms(cooldown.get(`${command.name}${message.author.id}`) - Date.now(), { long: true });
                return message.reply({
                  embeds: [{ description: `**عليك الانتظار\`${remainingTime.replace("minutes", "دقيقة").replace("seconds", "ثانية").replace("ms", "ملي ثانية")}\` لكي تتمكن من استخدام الامر مجددا.**`}],
                }).then(msg => setTimeout(() => msg.delete(), cooldown.get(`${command.name}${message.author.id}`) - Date.now()));
              }
              command.run(client, message, args);
              cooldown.set(`${command.name}${message.author.id}`, Date.now() + command.cooldown);
              setTimeout(() => cooldown.delete(`${command.name}${message.author.id}`), command.cooldown);
            } else {
              command.run(client, message, args);
            }
          }
        });

        await client11.login(Bot_token);

        if (!feedback) {
          await tokens.set(`feedback`, [{ token: Bot_token, prefix: Bot_prefix, clientId: client11.user.id, owner: interaction.user.id, timeleft: 2629744 }]);
        } else {
          await tokens.push(`feedback`, { token: Bot_token, prefix: Bot_prefix, clientId: client11.user.id, owner: interaction.user.id, timeleft: 2629744 });
        }
      } catch (error) {
        console.error(error);
        return interaction.editReply({ content: `**قم بتفعيل الخيارات الثلاثة او التاكد من توكن البوت ثم اعد المحاولة**` });
      }
    }
  }
};
