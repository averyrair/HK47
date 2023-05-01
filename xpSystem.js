const sqlActions = require('./sqlActions');
const { client } = require('./bot');

module.exports = {
    resetCooldowns,
    resolveScoreboard,
    messageSent,
    updateScoreboards,
}

const cooldowns = new Set();

function resetCooldowns() {
    cooldowns.clear();
}

async function resolveScoreboard(eventChannel, eventServer) {
    scores = await sqlActions.getTeamScores(eventServer);
    let announcement = '**Scoreboard Results**\n';
    for (let i = 0; i < scores.length; i++) {
        announcement += `${i+1}: ${scores[i].team_name} : ${scores[i].score}\n`;
    }
    eventChannel.send(announcement);
    sqlActions.startNewRound(eventServer);
}

async function messageSent(message) {

    if (cooldowns.has(message.member)) {
        return;
    }

    cooldowns.add(message.member);
    let xp = (10 * Math.random()) + 15;
    sqlActions.addXP(message.member, xp);

}

async function updateScoreboards() {

    const servers = Array.from(await client.guilds.fetch(), x => x[1]);

    servers.forEach(async server => {
        let guild = await server.fetch()
        let scores = await sqlActions.getTeamScores(guild);
        let scoreboard = await sqlActions.getScoreChannels(guild);
        for (let i = 0; i < scoreboard.length; i++) {
            let scoreChannel = await client.channels.fetch(scoreboard[i].channel_id);
            scoreChannel.setName(`${scoreboard[i].place}: ${(await guild.roles.fetch(scores[i].teamID)).name} - ${scores[i].score}`);
        }
    });
}