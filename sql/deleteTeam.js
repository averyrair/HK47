const { db } = require('../db');
const updateServerMembers = require('./updateServerMembers').updateServerMembers;

module.exports.deleteTeam = function deleteTeam(server, role) {
    db.query(`
        DELETE FROM teams WHERE team_id = ${db.escape(role.id)}
    `,
    (err, results) => {
        if (err) throw err
    });

    updateServerMembers(server);

}