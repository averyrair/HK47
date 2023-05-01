const { db } = require('../db');

module.exports.startNewRound = function startNewRound(server) {
    db.query(`
        UPDATE members
        SET previous_experience = experience, experience = 0
        WHERE server_id = ${db.escape(server.id)}
    `,
    (err, results) => {
        if (err) throw err;
    });

    db.query(`
        UPDATE \`events\`
        SET event_time = DATE_ADD(event_time, INTERVAL event_interval DAY)
        WHERE event_name = 'scoreboard' AND server_id = ${db.escape(server.id)}
    `,
    (err, results) => {
        if (err) throw err;
    });

}