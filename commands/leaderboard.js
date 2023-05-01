const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require('discord.js');
const sqlActions = require('../sqlActions');

const LeaderboardTabs = Object.freeze({
	COMPETITION: Symbol(0),
	LIFETIME: Symbol(1),
	TEAM: Symbol(2),
	PAZAAK: Symbol(3)
});

module.exports = {
    LeaderboardTabs,
    getCompetitionTab,
    getTeamTab,
    getButtons,
	data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Displays the individual points leaderboard.'),
		async execute(interaction) {
            interaction.reply({content: '', embeds: [await getCompetitionTab(interaction.guild)], components: [getButtons(LeaderboardTabs.COMPETITION)]});
		},

        // TO DO: add 'tabs' for lifetime leaderboard/level along with pazaak rating
};

async function getCompetitionTab(guild) {
    let scores = await sqlActions.getLB(guild);
    let response = '';
    if (scores.length == 0) {
        response = 'No scores to display yet. Go earn some xp!';
    } else {
        for (let i = 0; i < scores.length && i < 10; i++) {
            response += `${i+1}: <@${scores[i].user_id}> : ${scores[i].experience}xp\n`;
        }
    }

    return new EmbedBuilder()
    .setColor(0x533c61)
    .setTitle(`Leaderboard for ${guild.name}`)
    .addFields(
        {name: 'Competition XP' ,value: response},
    )
    .setTimestamp();
}

async function getTeamTab(guild) {
    let response = '';
    const scores = await sqlActions.getTeamScores(guild);
    if (scores.length == 0) {
        response = 'This server has no teams to display.'
    }
    else {
        for (let i = 0; i < scores.length; i++) {
            response += `${i+1}: <@&${scores[i].teamID}> : ${scores[i].score}\n`
        }
    }
    
    return new EmbedBuilder()
    .setColor(0x533c61)
    .setTitle(`Leaderboard for ${guild.name}`)
    .addFields(
        {name: 'Team Scores' ,value: response},
    )
    .setTimestamp();
}

function getButtons(tab) {
    return new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('leaderboard_competition_tab')
					.setLabel('Competition XP')
					.setStyle((tab == LeaderboardTabs.COMPETITION) ? ButtonStyle.Primary : ButtonStyle.Secondary)
                    .setDisabled(tab == LeaderboardTabs.COMPETITION),
                new ButtonBuilder()
                    .setCustomId('leaderboard_lifetime_tab')
                    .setLabel('Lifetime XP')
                    .setStyle((tab == LeaderboardTabs.LIFETIME) ? ButtonStyle.Primary : ButtonStyle.Secondary)
                    .setDisabled(true),
                new ButtonBuilder()
					.setCustomId('leaderboard_team_tab')
					.setLabel('Team Scores')
					.setStyle((tab == LeaderboardTabs.TEAM) ? ButtonStyle.Primary : ButtonStyle.Secondary)
                    .setDisabled(tab == LeaderboardTabs.TEAM),
                new ButtonBuilder()
					.setCustomId('leaderboard_pazaak_tab')
					.setLabel('Pazaak Ratings')
					.setStyle((tab == LeaderboardTabs.PAZAAK) ? ButtonStyle.Primary : ButtonStyle.Secondary)
                    .setDisabled(true),
			);
}