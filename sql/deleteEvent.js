const { db } = require('../db');

module.exports.deleteEvent = function deleteEvent(server, name) {
    db.query(`
        DELETE FROM events WHERE server_id = ${db.escape(server.id)} AND event_name = ${db.escape(name)}
    `,
    (err, results) => {
        if (err) throw err;
    });
}