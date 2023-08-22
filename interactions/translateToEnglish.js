const { ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');
const { translateMessage } = require('../gptRespond');

module.exports = {
	interactionID: 'translateToEnglish',
	data: new ContextMenuCommandBuilder()
        .setName('Translate To English')
        .setType(ApplicationCommandType.Message),
	async execute(interaction) {
		interaction.deferReply({ephemeral: true});
		const message = await interaction.channel.messages.fetch(interaction.targetId);
		const translation = await translateMessage(message.content, "English");
		await interaction.followUp({content: translation, ephemeral: true});
	},
};