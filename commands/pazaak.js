const { SlashCommandBuilder } = require('discord.js');
const { startGame } = require('../pazaakSystem');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('pazaak')
        .setDescription('Starts a game of pazaak.'),
	async execute(interaction) {
                interaction.reply("Pazaak is Temporarily Disabled")
        //startGame(interaction);
	},
};