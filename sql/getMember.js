const { db } = require('../db');

module.exports.getMember = function getMember(member) {
    return new Promise((resolve, reject) => {
        db.query(`
            SELECT *
            FROM members
            WHERE user_id = ${db.escape(member.user.id)} AND server_id = ${db.escape(member.guild.id)}
        `,
        (err, results) => {
            return err ? reject(err) : resolve(results[0]);
        });
    });
}