const { Events , ActivityType   } = require('discord.js');
const { prefix   } = require ('../../config.json');
module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		client.user.setStatus('dnd')
		console.log(`Ready! Logged in as ${client.user.tag} , My ID : ${client.user.id}`);
		let activities = [ `I'm Bot Maker !`, `Using ${prefix} Commands`], i = 0;  
    setInterval(() => client.user.setActivity({ name: `${activities[i++ % activities.length]}`, type: ActivityType.Listening }), 5000);
	},
};