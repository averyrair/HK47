const { db } = require('../db');

module.exports.setXP = function setXP(member, xp) {
    db.query(`
        UPDATE members
        SET experience = ${xp}
        WHERE user_id = ${db.escape(member.id)} AND server_id = ${db.escape(member.guild.id)}
    `,
    (err, results) => {
        if (err) throw err;
    });
}