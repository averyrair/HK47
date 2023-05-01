const { db } = require('../db');

module.exports.getEvent = function getEvent(server, name) {
    
    return new Promise((resolve, reject) => {
        db.query(`
            SELECT event_name, server_id, DATE_FORMAT(event_time, '%a %b %D at %I:%i %p Eastern') AS time, channel_id, event_interval, event_role_id
            FROM events
            WHERE server_id = ${db.escape(server.id)} AND event_name = ${db.escape(name)}
            LIMIT 1
        `,
        (err, results) => {
            return err ? reject(err) : resolve(results);
        });
    });
}