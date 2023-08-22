const { ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');
const { translateMessage } = require('../gptRespond');

module.exports = {
	interactionID: 'translateToSwedish',
	data: new ContextMenuCommandBuilder()
        .setName('Translate To Swedish')
        .setType(ApplicationCommandType.Message),
	async execute(interaction) {
		interaction.deferReply({ephemeral: true});
		const message = await interaction.channel.messages.fetch(interaction.targetId);
		const translation = await translateMessage(message.content, "Swedish");
		await interaction.followUp({content: translation, ephemeral: true});
	},
};