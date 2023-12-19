const { db } = require('../db');

module.exports.addCredits = function addCredits(member, credits) {
    db.query(`
        UPDATE members
        SET credits = credits + ${credits}
        WHERE user_id = ${db.escape(member.user.id)} AND server_id = ${db.escape(member.guild.id)}
    `,
    (err, results) => {
        if (err) throw err;
    });
}