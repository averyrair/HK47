const { db } = require('../db');

module.exports.setCreditsProb = function setCreditsProb(guild, prob) {
    db.query(`
        UPDATE servers
        SET credits_prob = ${prob}
        WHERE server_id = ${db.escape(guild.id)}
    `,
    (err, results) => {
        if (err) throw err;
    });
}