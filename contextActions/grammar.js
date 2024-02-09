const { ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');
const { respondToSituation } = require('../gptRespond');

module.exports = {
	data: new ContextMenuCommandBuilder()
        .setName('Translate')
        .setType(ApplicationCommandType.Message),
		async execute(interaction) {
			await interaction.reply('Pong! 🏓');
	},
};