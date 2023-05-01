const { db } = require('../db');

module.exports.getTeams = function getTeams(server) {
    return new Promise((resolve, reject) => {
        db.query(`
            SELECT *
            FROM teams
            WHERE server_id = ${db.escape(server.id)}
        `,
        (err, results) => {
            return err ? reject(err) : resolve(results)
        });
    });
}