const { ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');
const { translateMessage } = require('../gptRespond');

module.exports = {
	data: new ContextMenuCommandBuilder()
        .setName('translateToEnglish')
        .setType(ApplicationCommandType.Message),
	async execute(interaction) {
		interaction.deferReply();
		const message = await interaction.channel.messages.fetch(interaction.targetId);
		const translation = await translateMessage(message.content, "English")
		await interaction.followUp({content: translation, ephemeral: true});
	},
};