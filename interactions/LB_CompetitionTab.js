const { getCompetitionTab, getButtons, LeaderboardTabs } = require('../commands/leaderboard');

module.exports = {
    interactionID: 'leaderboard_competition_tab',
    execute: async (interaction) => {
        interaction.update({content: '', embeds: [await getCompetitionTab(interaction.guild)], components: [getButtons(LeaderboardTabs.COMPETITION)]});
    }
}