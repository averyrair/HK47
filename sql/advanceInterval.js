const { db } = require('../db');

module.exports.advanceInterval = function advanceInterval(event) {
    db.query(`
        UPDATE \`events\`
        SET event_time = DATE_ADD(event_time, INTERVAL event_interval DAY)
        WHERE event_name = ${db.escape(event.event_name)} AND server_id = ${db.escape(event.server_id)}
    `,
    (err, results) => {
        if (err) throw err;
    });
}