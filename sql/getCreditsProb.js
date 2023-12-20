const { db } = require('../db');

module.exports.getCreditsProb = function getCreditsProb(guild) {
    return new Promise((resolve, reject) => {
        db.query(`
            SELECT credits_prob
            FROM servers
            WHERE server_id = ${db.escape(guild.id)}
        `,
        (err, results) => {
            return err ? reject(err) : resolve(results[0].credits_prob)
        });
    });
}