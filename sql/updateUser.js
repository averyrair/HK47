const { db } = require('../db');

module.exports.updateUser = function updateUser(user) {
    db.query(`
        UPDATE users
        SET user_name = ${db.escape(user.tag)}
        WHERE user_id = ${db.escape(user.id)}
    `,
    (err, results) => {
        if (err) throw err;
    });
}