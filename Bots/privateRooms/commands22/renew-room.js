const { Client, Collection,ChannelType ,SlashCommandBuilder, GatewayIntentBits, Partials , EmbedBuilder, ApplicationCommandOptionType , Events , ActionRowBuilder , ButtonBuilder , ButtonStyle , Message, Embed,PermissionsBitField } = require("discord.js");
const { Database } = require("st.db")
const db = new Database("/Json-db/Bots/privateRoomsDB.json")
const rooms = new Database("/Json-db/Bots/privateRoomsDB.json")
let moment = require('moment');
const ms = require("ms")

const renewCooldown = new Collection()
module.exports = {
	name: 'renew-room',
	description: 'Renew a private room!',
	 run: async(client, message, args) => {
        if(!db.has(`recipient_${message.guild.id}`) || !db.has(`category_${message.guild.id}`) || !db.has(`roomprice_${message.guild.id}`) || !db.has(`renewprice_${message.guild.id}`) || !db.has(`role_${message.guild.id}`)) {
            return message.reply({content:`**لم يتم تحديد جميع الاعدادات , الرجاء ابلاغ احد المسؤولين**`})
           }
           if(!message.channel.name.startsWith(`ticket`)) return message.reply({content:`**يعمل الامر في التكت فقط**`})
           let theRooms = await rooms.get(`rooms_${message.guild.id}`)
        let theOwn = message.author.id
        let theGui = message.guild.id
        let findRoom = await theRooms.find(ro => (ro.roomowner == theOwn && ro.guildid == theGui))
        if(!findRoom) return message.reply({content:`**انت لا تمتلك روم للتجديد**`})
        if(renewCooldown.has(`${message.author.id}`)) return message.reply({ embeds:[{description:`**عليك الانتظار\`${ms(renewCooldown.get(`${message.author.id}`) - Date.now(), {long : true}).replace("minutes", `دقيقة`).replace("seconds", `ثانية`).replace("second", `ثانية`).replace("ms", `ملي ثانية`)}\` لكي تتمكن من استخدام الامر مجددا.**`}]}).then(msg => setTimeout(() => msg.delete(), renewCooldown.get(`${message.author.id}`) - Date.now()))
        renewCooldown.set(`${message.author.id}`, Date.now() + 3 * 60 * 1000)
        setTimeout(() => {
            try {
                renewCooldown.delete(`${message.author.id}`).catch(async() => {return;})
            } catch  {
                return;
            }
        }, 3 * 60 * 1000);
        let recipient = await db.get(`recipient_${message.guild.id}`)
           let roleid = await db.get(`role_${message.guild.id}`)
           let category = await db.get(`category_${message.guild.id}`)
           let renewprice = await db.get(`renewprice_${message.guild.id}`)
           renewprice = parseInt(renewprice)
           let tax1 = Math.floor(parseInt(renewprice) * 20 / 19 + 1)
           let embed1 = new EmbedBuilder()
           .setTimestamp()
           .setTitle(`**الرجاء اكمال التحويل لتجديد رومك**`)
           .setDescription(`**الرجاء تحويل ${tax1} الى <@${recipient}>\n\`\`\`#credit ${recipient} ${tax1}\`\`\`لديك 3 دقائق للتحويل**`)
           let send = await message.reply({embeds:[embed1]})
           const collectorFilter = m => (m.content.includes(renewprice) && m.content.includes(renewprice) && (m.content.includes(recipient) || m.content.includes(`<@${recipient}>`)) && m.author.id == `282859044593598464`)
           const collector = await message.channel.createMessageCollector({
            filter:collectorFilter,
            max: 1,
            time: 1000 * 60 * 3
        });
        collector.on(`collect` , async() => {
            let {roomowner , timeleft ,guildid, roomname , roomid} = findRoom;
            timeleft = timeleft + 60 * 60 * 24 * 7
            findRoom.timeleft = timeleft
            await rooms.set(`rooms_${message.guild.id}` , theRooms)
            let theMember = await message.guild.members.cache.find(mem => mem.id == message.author.id)
            let theRole = await message.guild.roles.cache.find(ro => ro.id == roleid)
            await theMember.roles.add(theRole)
            let doneembed = new EmbedBuilder()
            .setTitle(`**تم تجديد الروم بنجاح !**`)
            .setDescription(`**سيتم غلق التكت في غضون 10 ثواني**`)
            .setTimestamp()
            await send.delete();
             await message.channel.send({content:`**#${message.author}**` , embeds:[doneembed]})
                renewCooldown.delete(`${message.author.id}`)
             setTimeout(() => {
            return message.channel.delete();
        }, 1000 * 10);
        })
       
        },
};