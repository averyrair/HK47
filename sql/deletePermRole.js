const { db } = require('../db');

module.exports.deletePermRole = async function deletePermRole(roleId) {

    db.query(`
        DELETE FROM role_permissions WHERE role_id = ${db.escape(roleId)}
    `,
    (err, results) => {
        if (err) throw err;
    });

}