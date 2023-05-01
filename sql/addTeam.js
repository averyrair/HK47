const { db } = require('../db');
const updateServerMembers = require('./updateServerMembers').updateServerMembers;

module.exports.addTeam = function addTeam(server, role) {
    db.query(`
        INSERT INTO teams (team_id, server_id, team_name)
        SELECT
            ${db.escape(role.id)},
            ${db.escape(server.id)},
            ${db.escape(role.name)}
        WHERE NOT EXISTS
            (SELECT * FROM members WHERE team_id = ${db.escape(role.id)})
        LIMIT 1
    `,
    (err, results) => {
        if (err) throw err;
    });

    updateServerMembers(server);

} 