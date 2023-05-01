const { db } = require('../db');

module.exports.addXP = function addXP(member, xp) {
    db.query(`
        UPDATE members
        SET experience = experience + ${xp}
        WHERE user_id = ${db.escape(member.user.id)} AND server_id = ${db.escape(member.guild.id)}
    `,
    (err, results) => {
        if (err) throw err;
    });
}