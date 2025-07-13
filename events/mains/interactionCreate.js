const { Events, Interaction, EmbedBuilder ,InteractionType } = require('discord.js')
const config = require 
("../../config1.json")
module.exports = {
  name: Events.InteractionCreate,
    /**
    * @param {Interaction} interaction
  */
  async execute(interaction){
    if (interaction.isChatInputCommand()) {
	    if(interaction.user.bot) return;
	     let client = interaction.client;
		const command = interaction.client.slashcommands.get(interaction.commandName);
	    
		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}
		if (command.ownersOnly === true) {
			let owner1 = config.owner1
			let owner2 = config.owner2
			let owner3 = config.owner3
			let owner4 = config.owner4
			let owner5 = config.owner5
			let owner6 = config.owner6
			if (interaction.user.id !== owner1)
			if (interaction.user.id !== owner2)
			if (interaction.user.id !== owner3)
			if (interaction.user.id !== owner4)
			if (interaction.user.id !== owner5)
			if (interaction.user.id !== owner6)
			
			   {
			  return interaction.reply({content: `❗ ***لا تستطيع استخدام هذا الامر***`, ephemeral: true});
			}
		}
		try {
			await command.execute(interaction);
		} catch (err){
			console.error(err)
          return interaction.channel.send({ephemeral:true , content:`**هناك ضغط شديد على الخادم الرجاء الانتظار واستعمال الامر لاحقا.**`});
		}
    }
  }
}