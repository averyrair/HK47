const { db } = require('../db');

module.exports.addPermRole = function addPermRole(roleId, guildId, permString) {
    db.query(`
        INSERT INTO role_permissions (role_id, guild_id, permission)
        VALUES
            (${db.escape(roleId)},
            ${db.escape(guildId)},
            ${db.escape(permString)})
    `,
    (err, results) => {
        if (err) throw err;
    });
} 