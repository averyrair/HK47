const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const sqlActions = require('../sqlActions')

module.exports = {
	data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription('view your profile and stats'),
	async execute(interaction) {
		await interaction.reply(await getProfileEmbed(interaction));
	},
};

async function getProfileEmbed(interaction) {


    let body = `XP: ${(await sqlActions.getXP(interaction.member)).experience}\n` +
        `Credits: ${(await sqlActions.getMember(interaction.member)).credits}` +
        ` <:credits:1186794130098114600>`
    let embed = new EmbedBuilder()
    .setColor(0x533c61)
    .setTitle(`Profile for ${interaction.member.displayName}`)
    .addFields(
        {name: '⠀' ,value: body},
    )
    .setTimestamp();

    return {embeds: [embed]}
}