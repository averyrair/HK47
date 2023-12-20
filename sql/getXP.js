const { db } = require('../db');

module.exports.getXP = function getXP(member) {
    return new Promise((resolve, reject) => {
        db.query(`
            SELECT experience
            FROM members
            WHERE server_id = ${db.escape(member.guild.id)} AND user_id = ${db.escape(member.id)}
        `,
        (err, results) => {
            return err ? reject(err) : resolve(results[0])
        });
    });
}