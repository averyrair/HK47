const { db } = require('../db');

module.exports.addNewUser = function addNewUser(user) {
    db.query(`
        INSERT INTO users (user_id, user_name)
        SELECT ${db.escape(user.id)}, ${db.escape(user.tag)}
        WHERE NOT EXISTS (SELECT * FROM users WHERE user_id = ${db.escape(user.id)})
        LIMIT 1
    `,
    (err, results) => {
        if (err) throw err;
    });
}