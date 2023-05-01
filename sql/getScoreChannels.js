const { db } = require('../db');

module.exports.getScoreChannels = function getScoreChannels(server) {
    return new Promise((resolve, reject) => {
        db.query(`
            SELECT channel_id, place
            FROM scoreboards
            WHERE server_id = ${db.escape(server.id)}
            ORDER BY place
        `,
        (err, results) => {
            return err ? reject(err) : resolve(results);
        });
    });
}