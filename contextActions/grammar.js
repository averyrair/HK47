const { ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');
const { respondToSituation } = require('../gptRespond');

module.exports = {
	interactionID: 'Translate',
	data: new ContextMenuCommandBuilder()
        .setName('Translate')
        .setType(ApplicationCommandType.Message),
		async execute(interaction) {
			interaction.deferReply();
			const message = await interaction.channel.messages.fetch(interaction.targetId);
			const translation = await (respondToSituation(`${message.member.displayName} has sent the following message. ` +
				`There may be some spelling or grammar errors. If there is, please both mock ${message.member.displayName}` +
				`as well as sending the corrected message. If the message is already correct, instead mock ${interaction.member.displayName} ` +
				`for making a false accusation. Here is the message:\n${message.content}`	
			));
			await interaction.followUp(translation);
	},
};