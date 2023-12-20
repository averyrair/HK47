const { db } = require('../db');

module.exports.setCreditsPayout = function setCreditsPayout(guild, credits) {
    db.query(`
        UPDATE servers
        SET credits_pay = ${credits}
        WHERE server_id = ${db.escape(guild.id)}
    `,
    (err, results) => {
        if (err) throw err;
    });
}