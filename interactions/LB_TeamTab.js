const { getTeamTab, getButtons, LeaderboardTabs } = require('../commands/leaderboard');

module.exports = {
    interactionID: 'leaderboard_team_tab',
    execute: async (interaction) => {
        interaction.update({content: '', embeds: [await getTeamTab(interaction.guild)], components: [getButtons(LeaderboardTabs.TEAM)]});
    }
}