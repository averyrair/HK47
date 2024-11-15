//sqlAction setup
module.exports = {
    ...require('./sql/addCredits'),
    ...require('./sql/addEvent'),
    ...require('./sql/addNewMember'),
    ...require('./sql/addNewServer'),
    ...require('./sql/addNewUser'),
    ...require('./sql/addPermRole'),
    ...require('./sql/addScoreChannel'),
    ...require('./sql/addTeam'),
    ...require('./sql/addXP'),
    ...require('./sql/advanceInterval'),
    ...require('./sql/deleteEvent'),
    ...require('./sql/deletePermRole'),
    ...require('./sql/deleteScoreChannel'),
    ...require('./sql/deleteTeam'),
    ...require('./sql/getBannedChannels'),
    ...require('./sql/getCreditsPay'),
    ...require('./sql/getCreditsProb'),
    ...require('./sql/getEvent'),
    ...require('./sql/getExpiredEvents'),
    ...require('./sql/getLB'),
    ...require('./sql/getLifetimeLB'),
    ...require('./sql/getMember'),
    ...require('./sql/getMember'),
    ...require('./sql/getPermRole'),
    ...require('./sql/getScoreChannels'),
    ...require('./sql/getServerEvents'),
    ...require('./sql/getTeams'),
    ...require('./sql/getTeamScores'),
    ...require('./sql/getXP'),
    ...require('./sql/resetScores'),
    ...require('./sql/setCreditsPay'),
    ...require('./sql/setCreditsProb'),
    ...require('./sql/setPazaakCollection'),
    ...require('./sql/setSideDeck'),
    ...require('./sql/setXP'),
    ...require('./sql/startNewRound'),
    ...require('./sql/updateDB'),
    ...require('./sql/updateMember'),
    ...require('./sql/updateServer'),
    ...require('./sql/updateServerMembers'),
    ...require('./sql/updateUser'),
}