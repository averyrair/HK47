const { getLifetimeTab, getButtons, LeaderboardTabs } = require('../commands/leaderboard');

module.exports = {
    interactionID: 'leaderboard_lifetime_tab',
    execute: async (interaction) => {
        interaction.update({content: '', embeds: [await getLifetimeTab(interaction.guild)], components: [getButtons(LeaderboardTabs.LIFETIME)]});
    }
}