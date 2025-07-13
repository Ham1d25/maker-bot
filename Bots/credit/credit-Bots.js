
  const { Client, Collection, discord,GatewayIntentBits, Partials , EmbedBuilder, ApplicationCommandOptionType , Events , ActionRowBuilder , ButtonBuilder ,MessageAttachment, ButtonStyle , Message } = require("discord.js");
const { Database } = require("st.db")
const creditDB = new Database("/Json-db/Bots/creditDB.json")
const tokens = new Database("/tokens/tokens")
const tier1subscriptions = new Database("/database/makers/tier1/subscriptions")

  
   const Captchas = [
  {
    captcha: "https://media.discordapp.net/attachments/1147617619118129173/1200925482078720070/9.png?",
    number: "43293",
  },
  {
    captcha: "https://media.discordapp.net/attachments/1147617619118129173/1200925482670104577/10.png?",
    number: "88335",
  },
  {
    captcha: "https://media.discordapp.net/attachments/1147617619118129173/1200925483324407860/1.png?",
    number: "17929",
  },
  {
    captcha: "https://media.discordapp.net/attachments/1147617619118129173/1200925483727081492/2.png?",
    number: "94931",
  },
  {
    captcha: "https://media.discordapp.net/attachments/1147617619118129173/1200925484100354198/3.png?",
    number: "41863",
  },
  {
    captcha: "https://media.discordapp.net/attachments/1147617619118129173/1200925484536582194/4.png?",
    number: "25053",
  },
  {
    captcha: "https://media.discordapp.net/attachments/1147617619118129173/1200925484926640259/5.png?",
    number: "89725",
  },
  {
    captcha: "https://media.discordapp.net/attachments/1147617619118129173/1200925485371228240/6.png?",
    number: "55125",
  },
  {
    captcha: "https://media.discordapp.net/attachments/1147617619118129173/1200925485769699498/7.png?",
    number: "89725",
  },
  {
    captcha: "https://media.discordapp.net/attachments/1147617619118129173/1200925486130397224/8.png?",
    number: "10351",
  },
  {
    captcha: "https://media.discordapp.net/attachments/1147617619118129173/1200925590207868988/15.png?",
    number: "76565",
  },
  {
    captcha: "https://media.discordapp.net/attachments/1147617619118129173/1200925590744744007/16.png?",
    number: "86046",
  },
  {
    captcha: "https://media.discordapp.net/attachments/1147617619118129173/1200925591067709550/17.png?",
    number: "63930",
  },
  {
    captcha: "https://media.discordapp.net/attachments/1147617619118129173/1200925591420022794/18.png?",
    number: "21566",
  },
  {
    captcha: "https://media.discordapp.net/attachments/1147617619118129173/1200925591856234506/19.png?",
    number: "21842",
  },
  {
    captcha: "https://media.discordapp.net/attachments/1147617619118129173/1200925592346964089/20.png?",
    number: "89150",
  },
  {
    captcha: "https://media.discordapp.net/attachments/1147617619118129173/1200925593072582737/11.png?",
    number: "19801",
  },
  {
    captcha: "https://media.discordapp.net/attachments/1147617619118129173/1200925593429102672/12.png?",
    number: "16110",
  },
  {
    captcha: "https://media.discordapp.net/attachments/1147617619118129173/1200925593940799579/13.png?",
    number: "84210",
  },
  {
    captcha: "https://media.discordapp.net/attachments/1147617619118129173/1200925594343456868/14.png?",
    number: "56928",
  }
]
function getCaptcha() {
  const randomCaptcha = Math.floor(Math.random() * Captchas.length);
  const randomCaptcha2 = Captchas[randomCaptcha];
  const captcha = randomCaptcha2.captcha;
  const number = randomCaptcha2.number;
  return { captcha, number};
}
let credit = tokens.get('credit')
if(!credit) return;

const path = require('path');
const { readdirSync } = require("fs");
let theowner;
credit.forEach(async(data) => {
  const { REST } = require('@discordjs/rest');
  const { Routes } = require('discord-api-types/v10');
  const { prefix , token , clientId , owner } = data;
  theowner = owner
  const client16 = new Client({intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.MessageContent], shards: "auto", partials: [Partials.Message, Partials.Channel, Partials.GuildMember,]});
  client16.commands = new Collection();
  require(`./handlers/events`)(client16);
  client16.events = new Collection();
  require(`../../events/requireBots/credit-commands`)(client16);
  const rest = new REST({ version: '10' }).setToken(token);
  client16.on("ready" , async() => {

      try {
        await rest.put(
          Routes.applicationCommands(client16.user.id),
          { body: creditSlashCommands },
          );
          
        } catch (error) {
          console.error(error)
        }

    });
    require(`./handlers/events`)(client16)

  const folderPath = path.join(__dirname, 'slashcommand16');
  client16.creditSlashCommands = new Collection();
  const creditSlashCommands = [];
  const ascii = require("ascii-table");
  const table = new ascii("credit commands").setJustify();
  for (let folder of readdirSync(folderPath).filter(
    (folder) => !folder.includes(".")
    )) {
      for (let file of readdirSync(`${folderPath}/` + folder).filter((f) =>
      f.endsWith(".js")
      )) {
        let command = require(`${folderPath}/${folder}/${file}`);
        if (command) {
          creditSlashCommands.push(command.data.toJSON());
          client16.creditSlashCommands.set(command.data.name, command);
          if (command.data.name) {
            table.addRow(`/${command.data.name}`, "🟢 Working");
          } else {
            table.addRow(`/${command.data.name}`, "🔴 Not Working");
          }
        }
  }
}



const folderPath2 = path.join(__dirname, 'commands16');

for(let foldeer of readdirSync(folderPath2).filter((folder) => !folder.includes("."))) {
  for(let fiee of(readdirSync(`${folderPath2}/${foldeer}`).filter((fi) => fi.endsWith(".js")))) {
    const commander = require(`${folderPath2}/${foldeer}/${fiee}`)
  }
}

require(`../../events/requireBots/credit-commands`)(client16)
require("./handlers/events")(client16)

	for (let file of readdirSync('./events/').filter(f => f.endsWith('.js'))) {
		const event = require(`./events/${file}`);
	if (event.once) {
		client16.once(event.name, (...args) => event.execute(...args));
	} else {
		client16.on(event.name, (...args) => event.execute(...args));
	}
	}

client16.on('ready' , async() => {
  setInterval(async() => {
    let BroadcastTokenss = tokens.get(`credit`)
    let thiss = BroadcastTokenss.find(br => br.token == token)
    if(thiss) {
      if(thiss.timeleft <= 0) {
        await client16.destroy();
        console.log(`${clientId} Ended`)
      }
    }
  }, 1000);
})


  client16.on("interactionCreate" , async(interaction) => {
    if (interaction.isChatInputCommand()) {
      
	    if(interaction.user.bot) return;

      
      const command = client16.creditSlashCommands.get(interaction.commandName);
	    
      if (!command) {
        return;
      }
      if (command.ownersOnly === true) {
        if (owner != interaction.user.id) {
          return interaction.reply({content: `❗ ***لا تستطيع استخدام هذا الامر***`, ephemeral: true});
        }
      }
      try {

        await command.execute(interaction);
      } catch (error) {
			return
		}
    }
  } )

client16.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (
    message.content.startsWith(`${prefix}credit`) ||
    message.content.startsWith(`${prefix}credits`) ||
    message.content.startsWith(`c`)
  ) {
    let userCredits = creditDB.get(
      `credits_${message.author.id}_${message.guild.id}`
    );
    if (!userCredits) {
      await creditDB.set(
        `credits_${message.author.id}_${message.guild.id}`,
        0
      );
      userCredits = 0;
    }

    let commandArgs = message.content.split(" ");
    let userId = commandArgs[1];
    let amount = commandArgs[2];

    if (!userId) {
  return message.reply({
    content: `:bank: Your account balance is $${userCredits}.`,
  });
}

// تحديث السطر التالي بحسب الطريقة التي تفضلها

let user =
  message.mentions.members.first() ||
  (await client16.users.fetch(userId));

let user2Credits = creditDB.get(
  `credits_${user.id}_${message.guild.id}`
);
if (!user2Credits) {
  await creditDB.set(`credits_${user.id}_${message.guild.id}`, 0);
  user2Credits = 0;
}

if (!amount) {
  return message.channel.send({
    content: `:bank: **${message.author.username}**, your account balance is $${user2Credits}.`
  });
}

    if (amount > userCredits) {
      return message.reply({
        content: `:thinking: Your balance is not enough for that!`,
      });
    }

    const theTax = Math.floor(parseInt(amount) * (5 / 100));
    const theFinal = parseInt(amount) - parseInt(theTax);

    const randomCaptcha = getCaptcha();
    let { captcha, number } = randomCaptcha;
    let messageReply = await message.reply({
      content: `Transfer Fees: ${theTax}, Amount: $${theFinal}\nPlease type these numbers to confirm:`,
      files: [{ name: `captcha.png`, attachment: `${captcha}` }],
    });

    setTimeout(() => {
      try {
        messageReply.delete().catch(async () => {});
      } catch {
        return;
      }
    }, 15 * 1000);

    const filter = (m) => m.author.id == message.author.id;
    const messageCollect = message.channel.createMessageCollector({
      filter: filter,
      time: 15 * 1000,
      max: 1,
    });

    messageCollect.on("collect", async (msg) => {
      try {
        if (msg.content == number) {
          let newUser1 = parseInt(userCredits) - parseInt(amount);
          let newUser2 = parseInt(user2Credits) + parseInt(theFinal);

          await creditDB.set(
            `credits_${message.author.id}_${message.guild.id}`,
            newUser1
          );
          await creditDB.set(
            `credits_${user.id}_${message.guild.id}`,
            newUser2
          );

          await msg.reply({
            content: `:moneybag: ${message.author.username} has transferred $${theFinal} to ${user}.`,
          });
          await messageReply.delete();
          return msg.delete();
        } else {
          await messageReply.delete().catch(async () => {});
          return msg.delete().catch(async () => {});
        }
      } catch {
        return;
      }
    });
  }
})



   client16.login(token)
   .catch(async(err) => {
    const filtered = credit.filter(bo => bo != data)
			await tokens.set(`credit` , filtered)
      console.log(`${clientId} Not working and removed `)
   });


})
