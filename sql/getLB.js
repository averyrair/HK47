const { db } = require('../db');

module.exports.getLB = function getLB(server) {
    return new Promise((resolve, reject) => {
        db.query(`
            SELECT user_id, experience
            FROM members
            WHERE server_id = ${db.escape(server.id)} AND experience != 0
            ORDER BY experience DESC
        `,
        (err, results) => {
            return err ? reject(err) : resolve(results);
        });
    });
}