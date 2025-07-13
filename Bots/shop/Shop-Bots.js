
  const { Client, Collection, discord,GatewayIntentBits, Partials , EmbedBuilder, ApplicationCommandOptionType , Events , ActionRowBuilder , ButtonBuilder ,MessageAttachment, ButtonStyle , Message } = require("discord.js");
const { Database } = require("st.db")
const shopDB = new Database("/Json-db/Bots/shopDB.json")
const tokens = new Database("/tokens/tokens")
const tier1subscriptions = new Database("/database/makers/tier1/subscriptions")

let shop = tokens.get('shop')
if(!shop) return;

const path = require('path');
const { readdirSync } = require("fs");
shop.forEach(async(data) => {
  const { REST } = require('@discordjs/rest');
  const { Routes } = require('discord-api-types/v10');
  const { prefix , token , clientId , owner } = data;
  theowner = owner
  const client20 = new Client({intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.MessageContent], shards: "auto", partials: [Partials.Message, Partials.Channel, Partials.GuildMember,]});
  client20.commands = new Collection();
  require(`./handlers/events`)(client20);
  client20.events = new Collection();
  require(`../../events/requireBots/shop-commands`)(client20);
  const rest = new REST({ version: '10' }).setToken(token);
  client20.setMaxListeners(1000)

  client20.on("ready" , async() => {

      try {
        await rest.put(
          Routes.applicationCommands(client20.user.id),
          { body: shopSlashCommands },
          );
          
        } catch (error) {
          console.error(error)
        }

    });
    require(`../shop/handlers/events`)(client20)
  const folderPath = path.join(__dirname, 'slashcommand20');
  client20.shopSlashCommands = new Collection();
  const shopSlashCommands = [];
  const ascii = require("ascii-table");
  const table = new ascii("shop commands").setJustify();
  for (let folder of readdirSync(folderPath).filter(
    (folder) => !folder.includes(".")
    )) {
      for (let file of readdirSync(`${folderPath}/` + folder).filter((f) =>
      f.endsWith(".js")
      )) {
        let command = require(`${folderPath}/${folder}/${file}`);
        if (command) {
          shopSlashCommands.push(command.data.toJSON());
          client20.shopSlashCommands.set(command.data.name, command);
          if (command.data.name) {
            table.addRow(`/${command.data.name}`, "🟢 Working");
          } else {
            table.addRow(`/${command.data.name}`, "🔴 Not Working");
          }
        }
  }
}



const folderPath2 = path.join(__dirname, 'commands20');

for(let foldeer of readdirSync(folderPath2).filter((folder) => !folder.includes("."))) {
  for(let fiee of(readdirSync(`${folderPath2}/${foldeer}`).filter((fi) => fi.endsWith(".js")))) {
    const commander = require(`${folderPath2}/${foldeer}/${fiee}`)
  }
}

require(`../../events/requireBots/shop-commands`)(client20)
require("./handlers/events")(client20)

	for (let file of readdirSync('./events/').filter(f => f.endsWith('.js'))) {
		const event = require(`./events/${file}`);
	if (event.once) {
		client20.once(event.name, (...args) => event.execute(...args));
	} else {
		client20.on(event.name, (...args) => event.execute(...args));
	}
	}




  client20.on("interactionCreate" , async(interaction) => {
    if (interaction.isChatInputCommand()) {
      
	    if(interaction.user.bot) return;

      
      const command = client20.shopSlashCommands.get(interaction.commandName);
	    
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
			console.log(error)
		}
    }
  } )


client20.on("interactionCreate" , async(interaction) => {
  if(interaction.isModalSubmit()) {
    if(interaction.customId == "add_goods") {
      let type = interaction.fields.getTextInputValue(`type`)
      let Goods = interaction.fields.getTextInputValue(`Goods`)
      let products = shopDB.get(`products_${interaction.guild.id}`)
      let productFind = products.find(prod => prod.name == type)
      if(!productFind) return interaction.reply({content:`**لا يوجد منتج بهذا الاسم**`})
      let goodsFind = productFind.goods;
      const embed = new EmbedBuilder()
      .setTimestamp(Date.now())
      .setColor('#000000')
      Goods = Goods.split("\n")
      Goods.filter(item => item.trim() !== '')
      await goodsFind.push(...Goods)
      productFind.goods = Goods
      await shopDB.set(`products_${interaction.guild.id}` , products)
      embed.setTitle(`**[✅] تم اضافة السلع الى المنتج بنجاح**`)
      return interaction.reply({embeds:[embed]})
    }
  } 
})

   client20.login(token)
   .catch(async(err) => {
    const filtered = shop.filter(bo => bo != data)
			await tokens.set(`shop` , filtered)
      console.log(`${clientId} Not working and removed `)
   });


})
