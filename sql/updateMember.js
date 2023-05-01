const { db } = require('../db');
const getTeams = require('./getTeams').getTeams;

module.exports.updateMember = async function updateMember(member) {

    let memberTeam = new Promise(async (resolve, reject) => {
        (await getTeams(member.guild)).forEach((team) => {
            if (Array.from(member.roles.cache, x => x[1].id).includes(team.team_id)) {
                resolve(db.escape(team.team_id));
                return;
            }
        });
        resolve('NULL');
    });
    db.query(`
        UPDATE members
        SET 
            display_name = ${db.escape(member.displayName)},
            team_id = ${await memberTeam}
        WHERE user_id = ${db.escape(member.user.id)} AND server_id = ${db.escape(member.guild.id)}
    `,
    (err, results) => {
        if (err) throw err;
    });
}