const { db } = require('../db');

module.exports.getPermRole = function getPermRole(guildId, roleString) {
    return new Promise((resolve, reject) => {
        db.query(`
            SELECT *
            FROM role_permissions
            WHERE guild_id = ${db.escape(guildId)} AND permission = ${db.escape(roleString)}
        `,
        (err, results) => {
            return err ? reject(err) : resolve(results);
        });
    });
}