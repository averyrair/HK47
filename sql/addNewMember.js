const { db } = require('../db');

module.exports.addNewMember = function addNewMember(member) {
    db.query(`
        INSERT INTO members (user_id, server_id, display_name)
        SELECT
            ${db.escape(member.user.id)},
            ${db.escape(member.guild.id)},
            ${db.escape(member.displayName)}
        WHERE NOT EXISTS
            (SELECT * FROM members
                WHERE user_id = ${db.escape(member.user.id)}
                    AND server_id = ${db.escape(member.guild.id)})
        LIMIT 1
    `,
    (err, results) => {
        if (err) throw err;
    });
}