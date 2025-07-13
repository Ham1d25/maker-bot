const { Client, Collection, GatewayIntentBits, Partials, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events } = require("discord.js");
const { Database } = require("st.db");
const fs = require('fs');
const path = require('path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');

const setting = new Database("/database/settingsdata/setting");
const usersdata = new Database(`/database/usersdata/usersdata`);
const prices = new Database("/database/settingsdata/prices");
const invoices = new Database("/database/settingsdata/invoices");
const tokens = new Database("/tokens/tokens");
const orderDB = new Database("/Json-db/Bots/orderDB.json");

const tokensPath = 'tokens.txt';
let tokensString;

try {
    tokensString = fs.readFileSync(tokensPath, 'utf8');
} catch (error) {
    console.error("Error reading tokens file:", error);
    process.exit(1);
}

let tokenss = tokensString.split('\n').filter(Boolean).sort();

const Bot_token = tokenss.shift();

module.exports = {
    name: Events.InteractionCreate,
    /**
     * @param {Interaction} interaction
     */
    async execute(interaction) {
        if (interaction.isModalSubmit()) {
            if (interaction.customId == "BuyOrder_Modal") {
                await interaction.deferReply({ ephemeral: true });

                const userbalance = parseInt(usersdata.get(`balance_${interaction.user.id}_${interaction.guild.id}`));

                const Bot_prefix = interaction.fields.getTextInputValue(`Bot_prefix`);
                const client17 = new Client({ 
                    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.MessageContent], 
                    shards: "auto", 
                    partials: [Partials.Message, Partials.Channel, Partials.GuildMember]
                });

                try {
                    const owner = interaction.user.id;
                    let price1 = prices.get(`order_price_${interaction.guild.id}`) || 15;
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

                    client17.on("ready", async () => {
                        let doneembeduser = new EmbedBuilder()
                            .setTitle(`**تم انشاء بوتك بنجاح**`)
                            .setDescription(`**معلومات الفاتورة :**`)
                            .addFields(
                                { name: `**الفاتورة**`, value: `**\`${invoice}\`**`, inline: false },
                                { name: `**نوع البوت**`, value: `**\`طلبات\`**`, inline: false },
                                { name: `**توكن البوت**`, value: `**\`${Bot_token}\`**`, inline: false },
                                { name: `**البريفكس**`, value: `**\`${Bot_prefix}\`**`, inline: false }
                            );

                        await invoices.set(`${invoice}_${interaction.guild.id}`, {
                            type: `طلبات`,
                            token: `${Bot_token}`,
                            prefix: `${Bot_prefix}`,
                            userid: `${interaction.user.id}`,
                            guildid: `${interaction.guild.id}`,
                            serverid: `عام`,
                            price: price1
                        });

                        const newbalance = userbalance - price1;
                        await usersdata.set(`balance_${interaction.user.id}_${interaction.guild.id}`, newbalance);

                        const thebut = new ButtonBuilder().setLabel(`دعوة البوت`).setStyle(ButtonStyle.Link).setURL(`https://discord.com/api/oauth2/authorize?client_id=${client17.user.id}&permissions=8&scope=bot%20applications.commands`);
                        const rowss = new ActionRowBuilder().addComponents(thebut);
                        await interaction.user.send({ embeds: [doneembeduser], components: [rowss] });
                    });

                    const rest = new REST({ version: '10' }).setToken(Bot_token);
                    client17.commands = new Collection();
                    client17.events = new Collection();
                    require("../../Bots/order/handlers/events")(client17);
                    require("../../events/requireBots/order-commands")(client17);

                    const folderPath = path.resolve(__dirname, '../../Bots/order/slashcommand17');
                    const orderSlashCommands = [];
                    const ascii = require("ascii-table");
                    const table = new ascii("order commands").setJustify();

                    for (let folder of fs.readdirSync(folderPath).filter(folder => !folder.includes("."))) {
                        for (let file of fs.readdirSync(`${folderPath}/${folder}`).filter(f => f.endsWith(".js"))) {
                            let command = require(`${folderPath}/${folder}/${file}`);
                            if (command) {
                                orderSlashCommands.push(command.data.toJSON());
                                client17.orderSlashCommands.set(command.data.name, command);
                                if (command.data.name) {
                                    table.addRow(`/${command.data.name}`, "🟢 Working");
                                } else {
                                    table.addRow(`/${command.data.name}`, "🔴 Not Working");
                                }
                            }
                        }
                    }

                    const folderPath3 = path.resolve(__dirname, '../../Bots/order/handlers');
                    for (let file of fs.readdirSync(folderPath3).filter(f => f.endsWith('.js'))) {
                        require(path.join(folderPath3, file))(client17);
                    }

                    client17.on("messageCreate", async message => {
                        if (message.author.bot) return;

                        const line = orderDB.get(`line_${message.guild.id}`);
                        const chan = orderDB.get(`order_rooms_${message.guild.id}`);
                        const role = orderDB.get(`role_${message.guild.id}`);

                        if (line && chan && role) {
                            if (chan != message.channel.id) return;
                            const button1 = new ButtonBuilder()
                                .setCustomId(`order`)
                                .setLabel(`0`)
                                .setEmoji("🛒")
                                .setStyle(ButtonStyle.Success);
                            const row = new ActionRowBuilder().addComponents(button1);
                            await message.channel.send({ content: `${message.content}\n${line}`, components: [row] }).catch(() => {
                                return interaction.reply({ content: `**الرجاء التأكد من صلاحياتي**` });
                            });
                            return message.delete();
                        }
                    });

                    client17.on('ready', async () => {
                        setInterval(async () => {
                            let BroadcastTokenss = tokens.get(`order`);
                            let thiss = BroadcastTokenss.find(br => br.token == Bot_token);
                            if (thiss) {
                                if (thiss.timeleft <= 0) {
                                    console.log(`${client17.user.id} Ended`);
                                    await client17.destroy();
                                }
                            }
                        }, 1000);
                    });

                    client17.on("ready", async () => {
                        try {
                            await rest.put(Routes.applicationCommands(client17.user.id), { body: orderSlashCommands });
                        } catch (error) {
                            console.error(error);
                        }
                    });

                    const folderPath2 = path.resolve(__dirname, '../../Bots/order/events');
                    for (let file of fs.readdirSync(folderPath2).filter(f => f.endsWith('.js'))) {
                        require(path.join(folderPath2, file));
                    }

                    client17.on("interactionCreate", async interaction => {
                        if (interaction.isChatInputCommand()) {
                            if (interaction.user.bot) return;

                            const command = client17.orderSlashCommands.get(interaction.commandName);
                            if (!command) {
                                console.error(`No command matching ${interaction.commandName} was found.`);
                                return;
                            }
                            if (command.ownersOnly === true && owner != interaction.user.id) {
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

                    client17.on("messageCreate", async message => {
                        if (message.author.bot || message.channel.type === 'dm') return;

                        if (!message.content.startsWith(Bot_prefix)) return;
                        const args = message.content.slice(Bot_prefix.length).trim().split(/ +/g);
                        const cmd = args.shift().toLowerCase();
                        if (cmd.length == 0) return;

                        let command = client17.commands.get(cmd) || client17.commands.get(client17.commandaliases.get(cmd));
                        if (command) {
                            if (command.ownersOnly && owner != message.author.id) {
                                return message.reply({ content: `❗ ***لا تستطيع استخدام هذا الامر***`, ephemeral: true });
                            }
                            if (command.cooldown) {
                                if (cooldown.has(`${command.name}${message.author.id}`)) {
                                    return message.reply({ embeds: [{ description: `**عليك الانتظار\`${ms(cooldown.get(`${command.name}${message.author.id}`) - Date.now(), { long: true }).replace("minutes", `دقيقة`).replace("seconds", `ثانية`).replace("second", `ثانية`).replace("ms", `ملي ثانية`)}\` لكي تتمكن من استخدام الامر مجددا.**` }] })
                                        .then(msg => setTimeout(() => msg.delete(), cooldown.get(`${command.name}${message.author.id}`) - Date.now()));
                                }
                                command.run(client17, message, args);
                                cooldown.set(`${command.name}${message.author.id}`, Date.now() + command.cooldown);
                                setTimeout(() => { cooldown.delete(`${command.name}${message.author.id}`); }, command.cooldown);
                            } else {
                                command.run(client17, message, args);
                            }
                        }
                    });

                    client17.login(Bot_token);
                } catch (error) {
                    console.error(error);
                    return interaction.editReply({ content: `**حدث خطأ أثناء تنفيذ الطلب. الرجاء المحاولة مجددًا لاحقًا.**` });
                }
            }
        }
    }
};
