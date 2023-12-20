const { SlashCommandBuilder } = require('discord.js');
const { startGame } = require('../pazaakSystem');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('pazaak')
        .setDescription('Starts a game of pazaak.')
        .addIntegerOption(option =>
                option.setName('wager')
                        .setDescription('The wager for the game.')
                        .setRequired(false)
                        .setMinValue(0)
                        .setMaxValue(1000000)
        ),
	async execute(interaction) {
                //interaction.reply("Pazaak is Temporarily Disabled")
                startGame(interaction);
	},
};