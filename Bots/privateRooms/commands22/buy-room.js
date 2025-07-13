const { Client, Collection,ChannelType ,SlashCommandBuilder, GatewayIntentBits, Partials , EmbedBuilder, ApplicationCommandOptionType , Events , ActionRowBuilder , ButtonBuilder , ButtonStyle , Message, Embed,PermissionsBitField } = require("discord.js");
const { Database } = require("st.db")
const db = new Database("/Json-db/Bots/privateRoomsDB.json")
const rooms = new Database("/Json-db/Bots/privateRoomsDB.json")
let moment = require('moment');
const ms = require("ms")

const buyCooldown = new Collection()
module.exports = {
	name: 'buy-room',
	description: 'Buy a private room!',
	 run: async(client, message, args) => {
        if(!db.has(`recipient_${message.guild.id}`) || !db.has(`category_${message.guild.id}`) || !db.has(`roomprice_${message.guild.id}`) || !db.has(`renewprice_${message.guild.id}`) || !db.has(`role_${message.guild.id}`)) {
            return message.reply({content:`**لم يتم تحديد جميع الاعدادات , الرجاء ابلاغ احد المسؤولين**`})
           }
           if(!message.channel.name.startsWith(`ticket`)) return message.reply({content:`**يعمل الامر في التكت فقط**`})
           let theRooms = await rooms.get(`rooms_${message.guild.id}`)
        let theOwn = message.author.id
        let theGui = message.guild.id
        let findRoom = await theRooms.find(ro => (ro.roomowner == theOwn && ro.guildid == theGui))
        if(findRoom) return message.reply({content:`**انت تملك روم بالفعل ولا يمكنك امتلاك اكثر من روم**`})
        if(buyCooldown.has(`${message.author.id}`)) return message.reply({ embeds:[{description:`**عليك الانتظار\`${ms(buyCooldown.get(`${message.author.id}`) - Date.now(), {long : true}).replace("minutes", `دقيقة`).replace("seconds", `ثانية`).replace("second", `ثانية`).replace("ms", `ملي ثانية`)}\` لكي تتمكن من استخدام الامر مجددا.**`}]}).then(msg => setTimeout(() => msg.delete(), buyCooldown.get(`${message.author.id}`) - Date.now()))
       let roomname = message.content.split(" ").slice(1).join(` `)
    if(!roomname) return message.reply({content:`**قم بتحديد اسم الروم بحد الامر**`})
    if(theRooms.length >= 10) return message.reply({content:`**يوجد 10 رومات ولا يمكن شراء المزيد , الرجاء الانتظار حين وجود مكان لروم فارغ**`})
        buyCooldown.set(`${message.author.id}`, Date.now() + 3 * 60 * 1000)
        setTimeout(() => {
            try {
                buyCooldown.delete(`${message.author.id}`).catch(async() => {return;})
            } catch  {
                return;
            }
        }, 3 * 60 * 1000);
        
        let recipient = await db.get(`recipient_${message.guild.id}`)
           let roleid = await db.get(`role_${message.guild.id}`)
           let category = await db.get(`category_${message.guild.id}`)
           let roomprice = await db.get(`roomprice_${message.guild.id}`)
           roomprice = parseInt(roomprice)
           let tax1 = Math.floor(parseInt(roomprice) * 20 / 19 + 1)
           let embed1 = new EmbedBuilder()
           .setTimestamp()
           .setTitle(`**الرجاء اكمال التحويل لشراء رومك**`)
           .setDescription(`**الرجاء تحويل ${tax1} الى <@${recipient}>\n\`\`\`#credit ${recipient} ${tax1}\`\`\`لديك 3 دقائق للتحويل**`)
           let send = await message.reply({embeds:[embed1]})
           const collectorFilter = m => (m.content.includes(roomprice) && m.content.includes(roomprice) && (m.content.includes(recipient) || m.content.includes(`<@${recipient}>`)) && m.author.id == `282859044593598464`)
           const collector = await message.channel.createMessageCollector({
            filter:collectorFilter,
            max: 1,
            time: 1000 * 60 * 3
        });
        collector.on(`collect` , async() => {
            let theRoom = await message.guild.channels.create({
                name:`${roomname}`,
                parent:`${category}`,
                type:`${ChannelType.GuildText}`,
                rateLimitPerUser:60 * 30,
                permissionOverwrites:[
                    {
                        id: message.guild.id,
                        deny: [
                            PermissionsBitField.Flags.AttachFiles,
                            PermissionsBitField.Flags.EmbedLinks,
                            PermissionsBitField.Flags.SendMessages,
                            PermissionsBitField.Flags.MentionEveryone
                        ],
                    },
                    {
                        id: message.author.id,
                        allow: [
                            PermissionsBitField.Flags.AttachFiles,
                            PermissionsBitField.Flags.EmbedLinks,
                            PermissionsBitField.Flags.SendMessages,
                            PermissionsBitField.Flags.MentionEveryone
                        ],
                    },
                ]
            })
            await rooms.push(`rooms_${message.guild.id}`,{
                roomowner:message.author.id,
                roomname:roomname,
                roomid:theRoom.id,
                guildid:message.guild.id,
                timeleft:60 * 60 * 24 * 7
            })
            let theMember = await message.guild.members.cache.find(mem => mem.id == message.author.id)
            let theRole = await message.guild.roles.cache.find(ro => ro.id == roleid)
            await theMember.roles.add(theRole)
            let doneembed = new EmbedBuilder()
            .setTitle(`**تم شراء الروم بنجاح !**`)
            .setDescription(`**تم شراء رومك بنجاح وصلاحيتها 7 أيام من الأن\nوسيتم غلق التكت في غضون 10 ثواني**`)
            .setTimestamp()
            let embed1 = new EmbedBuilder()
            .setColor(`Yellow`)
            .setTimestamp(Date.now() + ms(`7d`))
            .addFields(
            {
                name:`**صاحب الروم**`,value:`${message.author}`,inline:false
            },
            {
                name:`**مدة الروم**`,value:`**\`\`\`7 أيام\`\`\`**`,inline:false
            },
            {
                name:`**تاريخ بداية الروم**`,value:`**\`\`\`${moment().format('YYYY-MM-DD')}\`\`\`**`,inline:false
            },
            {
                name:`**تاريخ انتهاء الروم**`,value:`**\`\`\`${moment().add(7 , 'days').format('YYYY-MM-DD')}\`\`\`**`,inline:false
            },
            )
            await theRoom.send({embeds:[embed1]})
            await send.delete();
             await message.channel.send({content:`**#${message.author} - ${theRoom}**` , embeds:[doneembed]})
                buyCooldown.delete(`${message.author.id}`)
             setTimeout(() => {
            return message.channel.delete();
        }, 1000 * 10);
        })
       
        },
};