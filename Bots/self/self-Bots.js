const { Client, Collection, discord, GatewayIntentBits, Partials, EmbedBuilder, ApplicationCommandOptionType, Events, ActionRowBuilder, ButtonBuilder, MessageAttachment, ButtonStyle, Message } = require("discord.js");
const { Database } = require("st.db");
const selfDB = new Database("/Json-db/Bots/selfDB.json"); // تغيير الاسم من creditDB إلى selfDB
const tokens = new Database("/tokens/tokens");
const tier1subscriptions = new Database("/database/makers/tier1/subscriptions");
const Captchas = [
    {
        captcha: `https://cdn.discordapp.com/attachments/1204187638312210543/1204926002699182280/72958.webp?ex=65d681c9&is=65c40cc9&hm=57b8d46993aa2887de00aed0454a50f1c26d0e8685b72d1cdb1be1ee3c98b3fc&`,
        number: 72958
    },
    {
        captcha: `https://cdn.discordapp.com/attachments/1204187638312210543/1204926016909344818/88275.webp?ex=65d681cc&is=65c40ccc&hm=05eff69069d015563977e36bb28dbf11e830aa5458e1c7afcb8122a54f21cad3&`,
        number: 88275
    },
    {
        captcha: `https://cdn.discordapp.com/attachments/1204187638312210543/1204926034206793769/89725.webp?ex=65d681d0&is=65c40cd0&hm=926a0e27b45ab8d8e659e3134c70e322bbe10aa3ef04b1880ab2521e18bd1320&`,
        number: 89725
    },
    {
        captcha: `https://cdn.discordapp.com/attachments/1204187638312210543/1204926048706502696/99910.webp?ex=65d681d4&is=65c40cd4&hm=d068caa101daaee3adc0ba6a330798a28a18ee33a956c62357f1c99f2d730a09&`,
        number: 99910
    },
    {
        captcha: `https://cdn.discordapp.com/attachments/1204187638312210543/1204926069442875472/88039.webp?ex=65d681d9&is=65c40cd9&hm=4cf8a36181df072ab47fac6f91663a5e6008e5dafeca3e5d42619e202ad36a58&`,
        number: 88039
    }
];
function getCaptcha() {
    const randomCaptcha = Math.floor(Math.random() * Captchas.length);
    const randomCaptcha2 = Captchas[randomCaptcha];
    const captcha = randomCaptcha2.captcha;
    const number = randomCaptcha2.number;
    return { captcha, number };
}
let self = tokens.get('self'); // تغيير الاسم من credit إلى self
if (!self) return;

const path = require('path');
const { readdirSync } = require("fs");
let theowner;
self.forEach(async (data) => {
    const { REST } = require('@discordjs/rest');
    const { Routes } = require('discord-api-types/v10');
    const { prefix, token, clientId, owner } = data;
    theowner = owner;
    const client1000 = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.MessageContent], shards: "auto", partials: [Partials.Message, Partials.Channel, Partials.GuildMember,] });
    client1000.commands = new Collection();
    require(`./handlers/events`)(client1000);
    client1000.events = new Collection();
    require(`../../events/requireBots/self-commands`)(client1000); // تغيير الاسم من credit-commands إلى self-commands
    const rest = new REST({ version: '10' }).setToken(token);
    client1000.on("ready", async () => {

        try {
            await rest.put(
                Routes.applicationCommands(client1000.user.id),
                { body: selfSlashCommands }, // تغيير الاسم من creditSlashCommands إلى selfSlashCommands
            );

        } catch (error) {
            console.error(error);
        }

    });
    require(`./handlers/events`)(client1000);

    const folderPath = path.join(__dirname, 'slashcommand1000');
    client1000.selfSlashCommands = new Collection(); // تغيير الاسم من creditSlashCommands إلى selfSlashCommands
    const selfSlashCommands = []; // تغيير الاسم من creditSlashCommands إلى selfSlashCommands
    const ascii = require("ascii-table");
    const table = new ascii("self commands").setJustify(); // تغيير الاسم من credit commands إلى self commands
    for (let folder of readdirSync(folderPath).filter(
        (folder) => !folder.includes(".")
    )) {
        for (let file of readdirSync(`${folderPath}/` + folder).filter((f) =>
            f.endsWith(".js")
        )) {
            let command = require(`${folderPath}/${folder}/${file}`);
            if (command) {
                selfSlashCommands.push(command.data.toJSON()); // تغيير الاسم من creditSlashCommands إلى selfSlashCommands
                client1000.selfSlashCommands.set(command.data.name, command);
                if (command.data.name) {
                    table.addRow(`/${command.data.name}`, "🟢 Working");
                } else {
                    table.addRow(`/${command.data.name}`, "🔴 Not Working");
                }
            }
        }
    }

    const folderPath2 = path.join(__dirname, 'commands1000');

    for (let foldeer of readdirSync(folderPath2).filter((folder) => !folder.includes("."))) {
        for (let fiee of (readdirSync(`${folderPath2}/${foldeer}`).filter((fi) => fi.endsWith(".js")))) {
            const commander = require(`${folderPath2}/${foldeer}/${fiee}`);
        }
    }

    require(`../../events/requireBots/self-commands`)(client1000); // تغيير الاسم من credit-commands إلى self-commands
    require("./handlers/events")(client1000);

    for (let file of readdirSync('./events/').filter(f => f.endsWith('.js'))) {
        const event = require(`./events/${file}`);
        if (event.once) {
            client1000.once(event.name, (...args) => event.execute(...args));
        } else {
            client1000.on(event.name, (...args) => event.execute(...args));
        }
    }

    client1000.on('ready', async () => {
        setInterval(async () => {
            let BroadcastTokenss = tokens.get(`self`); // تغيير الاسم من credit إلى self
            let thiss = BroadcastTokenss.find(br => br.token == token);
            if (thiss) {
                if (thiss.timeleft <= 0) {
                    await client1000.destroy();
                    console.log(`${clientId} Ended`);
                }
            }
        }, 1000);
    });


    client1000.on("interactionCreate", async (interaction) => {
        if (interaction.isChatInputCommand()) {

            if (interaction.user.bot) return;

            const command = client1000.selfSlashCommands.get(interaction.commandName); // تغيير الاسم من creditSlashCommands إلى selfSlashCommands

            if (!command) {
                return;
            }
            if (command.ownersOnly === true) {
                if (owner != interaction.user.id) {
                    return interaction.reply({ content: `❗ ***لا تستطيع استخدام هذا الامر***`, ephemeral: true });
                }
            }
            try {

                await command.execute(interaction);
            } catch (error) {
                return;
            }
        }
    });

client1000.on('interactionCreate', async interaction => {
        if (!interaction.isButton()) return;

        if (interaction.customId === 'role1') { // التحقق من ايدي الزر
            const member = interaction.member;


            try {
                const roleId = await selfDB.get(`role1_${interaction.guildId}`); // تغيير الاسم من creditDB إلى selfDB
                if (!roleId) {
                    return console.error('**لم يتم تعيين الرولات لهذا السيرفر بعد**');
                }

                const role = interaction.guild.roles.cache.get(roleId);

                if (!role) {
                    return console.error('**الرول غير موجود**');
                }

                await member.roles.add(role);
                await interaction.reply({ content: '**تم إعطاؤك الرول بنجاح!**', ephemeral: true });
            } catch (error) {
                console.error('فشل في إضافة الدور:', error);
                await interaction.reply({ content: '**يرجى التأكد ان رتبة البوت اعلى من الرتبة المحددة**', ephemeral: true });
            }
        }
    });

client1000.on('interactionCreate', async interaction => {
        if (!interaction.isButton()) return;

        if (interaction.customId === 'role2') { // التحقق من ايدي الزر
            const member = interaction.member;


            try {
                const roleId = await selfDB.get(`role2_${interaction.guildId}`); // تغيير الاسم من creditDB إلى selfDB
                if (!roleId) {
                    return console.error('**لم يتم تعيين الرولات لهذا السيرفر بعد**');
                }

                const role = interaction.guild.roles.cache.get(roleId);

                if (!role) {
                    return console.error('**الرول غير موجود**');
                }

                await member.roles.add(role);
                await interaction.reply({ content: '**تم إعطاؤك الرول بنجاح!**', ephemeral: true });
            } catch (error) {
                console.error('فشل في إضافة الدور:', error);
                await interaction.reply({ content: '**يرجى التأكد ان رتبة البوت اعلى من الرتبة المحددة**', ephemeral: true });
            }
        }
    });

client1000.on('interactionCreate', async interaction => {
        if (!interaction.isButton()) return;

        if (interaction.customId === 'role3') { // التحقق من ايدي الزر
            const member = interaction.member;


            try {
                const roleId = await selfDB.get(`role3_${interaction.guildId}`); // تغيير الاسم من creditDB إلى selfDB
                if (!roleId) {
                    return console.error('**لم يتم تعيين الرولات لهذا السيرفر بعد**');
                }

                const role = interaction.guild.roles.cache.get(roleId);

                if (!role) {
                    return console.error('**الرول غير موجود**');
                }

                await member.roles.add(role);
                await interaction.reply({ content: '**تم إعطاؤك الرول بنجاح!**', ephemeral: true });
            } catch (error) {
                console.error('فشل في إضافة الدور:', error);
                await interaction.reply({ content: '**يرجى التأكد ان رتبة البوت اعلى من الرتبة المحددة**', ephemeral: true });
            }
        }
    });

client1000.on('interactionCreate', async interaction => {
        if (!interaction.isButton()) return;

        if (interaction.customId === 'role4') { // التحقق من ايدي الزر
            const member = interaction.member;


            try {
                const roleId = await selfDB.get(`role4_${interaction.guildId}`); // تغيير الاسم من creditDB إلى selfDB
                if (!roleId) {
                    return console.error('**لم يتم تعيين الرولات لهذا السيرفر بعد**');
                }

                const role = interaction.guild.roles.cache.get(roleId);

                if (!role) {
                    return console.error('**الرول غير موجود**');
                }

                await member.roles.add(role);
                await interaction.reply({ content: '**تم إعطاؤك الرول بنجاح!**', ephemeral: true });
            } catch (error) {
                console.error('فشل في إضافة الدور:', error);
                await interaction.reply({ content: '**يرجى التأكد ان رتبة البوت اعلى من الرتبة المحددة**', ephemeral: true });
            }
        }
    });





    client1000.login(token)
        .catch(async (err) => {
            const filtered = self.filter(bo => bo != data);
            await tokens.set(`self`, filtered); // تغيير الاسم من credit إلى self
            console.log(`${clientId} Not working and removed `);
        });

});
