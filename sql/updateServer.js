const { db } = require('../db');

module.exports.updateServer = function updateServer(server) {
    db.query(`
        UPDATE servers
        SET server_name = ${db.escape(server.name)}
        WHERE server_id = ${db.escape(server.id)}
    `,
    (err, results) => {
        if (err) throw err;
    });
}