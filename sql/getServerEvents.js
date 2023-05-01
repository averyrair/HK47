const { db } = require('../db');

module.exports.getServerEvents = function getServerEvents(server) {
    return new Promise((resolve, reject) => {
        db.query(`
            SELECT event_name, server_id, channel_id, DATE_FORMAT(event_time, '%a %b %D at %I:%i %p Eastern') AS time, event_interval, event_role_id
            FROM events
            WHERE server_id = ${db.escape(server.id)}
        `,
        (err, results) => {
            return err ? reject(err) : resolve(results);
        });
    });
}