const { db } = require('../db');

module.exports.getCreditsPay = function getCreditsPay(guild) {
    return new Promise((resolve, reject) => {
        db.query(`
            SELECT credits_pay
            FROM servers
            WHERE server_id = ${db.escape(guild.id)}
        `,
        (err, results) => {
            return err ? reject(err) : resolve(results[0].credits_pay)
        });
    });
}