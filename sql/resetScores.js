const { db } = require('../db');

module.exports.resetScores = function resetScores(server) {
    db.query(`
        UPDATE members
        SET experience = DEFAULT
        WHERE server_id = ${db.escape(server.id)}
    `,
    (err, results) => {
        if (err) throw err;
    });
}