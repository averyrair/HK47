const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('message')
        .setDescription('Sends a message to the indicated channel from the bot\'s account.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option =>
            option.setName('message')
                .setDescription('The message that should be sent.')
                .setRequired(true)),
	async execute(interaction) {

        await interaction.deferReply();
        await interaction.deleteReply();
        await interaction.channel.send(interaction.options.getString('message'));
	},
};