const { db } = require('../db');

module.exports.getLifetimeLB = function getLifetimeLB(server) {
    return new Promise((resolve, reject) => {
        db.query(`
            SELECT user_id, lifetime_xp
            FROM members
            WHERE server_id = ${db.escape(server.id)} AND lifetime_xp != 0
            ORDER BY lifetime_xp DESC
        `,
        (err, results) => {
            return err ? reject(err) : resolve(results);
        });
    });
}