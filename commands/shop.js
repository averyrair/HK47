const { SlashCommandBuilder, } = require('discord.js');
const { initShop } = require('../shopSystem')

module.exports = {
	data: new SlashCommandBuilder()
        .setName('shop')
        .setDescription('use your credits to buy shiny things.'),
	async execute(interaction) {
		initShop(interaction);
	},
};