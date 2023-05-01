const { db } = require('../db');

module.exports.addEvent = function addEvent(name, channel, time, interval, role) {
    if (role == null) role = 'NULL';
    else role = db.escape(role.id);

    db.query(`
        INSERT INTO events
            (event_name, server_id, channel_id, event_time, event_interval, event_role_id)
        VALUES (${db.escape(name)}, ${db.escape(channel.guild.id)}, ${db.escape(channel.id)}, ${db.escape(time)}, ${db.escape(interval)}, ${role})
    `,
    (err, results) => {
        if (err) throw err
    });
}