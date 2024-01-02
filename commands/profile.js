const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const sqlActions = require('../sqlActions')

module.exports = {
	data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription('view your profile and stats'),
	async execute(interaction) {
		await interaction.reply(await getProfileEmbed(interaction));
	},
};


const pazaakSymbols = new Map([
    ["B1", "<:pazaak_blue_1:894706597782257705>"],
    ["B2", "<:pazaak_blue_2:894706597845151864>"],
    ["B3", "<:pazaak_blue_3:894706597899698277>"],
    ["B4", "<:pazaak_blue_4:894706597887090830>"],
    ["B5", "<:pazaak_blue_5:894706598071631883>"],
    ["B6", "<:pazaak_blue_6:894706597572513823>"],
    ["R1", "<:pazaak_red_1:894706597991948339>"],
    ["R2", "<:pazaak_red_2:894706597761273898>"],
    ["R3", "<:pazaak_red_3:894706598017122424>"],
    ["R4", "<:pazaak_red_4:894706597606076437>"],
    ["R5", "<:pazaak_red_5:894706597731909725>"],
    ["R6", "<:pazaak_red_6:894706598113607740>"],
    ["P1", "<:pazaak_purple_1:894706597765480490>"],
    ["P2", "<:pazaak_purple_2:894706598046470194>"],
    ["P3", "<:pazaak_purple_3:894706598021328927>"],
    ["P4", "<:pazaak_purple_4:894706597673205831>"],
    ["P5", "<:pazaak_purple_5:894706598038097990>"],
    ["P6", "<:pazaak_purple_6:894706597970984991>"]
]);


async function getProfileEmbed(interaction) {

    let body = `XP: ${(await sqlActions.getXP(interaction.member))}\n` +
        `Credits: ${(await sqlActions.getMember(interaction.member)).credits}` +
        ` <:credits:1186794130098114600>\n\nPazaak Side Deck:\n`;

    let pazaakDeck = (await sqlActions.getMember(interaction.member)).pazaak_sidedeck;
    for (let i = 0; i < 10; i += 2) {
        body += pazaakSymbols.get(pazaakDeck.substring(i, i+2));
    }
    body += '\n'
    for (let i = 10; i < 20; i += 2) {
        body += pazaakSymbols.get(pazaakDeck.substring(i, i+2));
    }

    let embed = new EmbedBuilder()
    .setColor(0x533c61)
    .setTitle(`Profile for ${interaction.member.displayName}`)
    .addFields(
        {name: '⠀' ,value: body},
    )
    .setTimestamp();

    const buttonRow = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('manage_pazaak')
                .setLabel('Manage Pazaak Cards')
                .setStyle(ButtonStyle.Secondary),
        );

    return {embeds: [embed], components: [buttonRow]}
}