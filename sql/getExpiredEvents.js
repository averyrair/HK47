const { db } = require('../db');
const moment = require('moment');

module.exports.getExpiredEvents = function getExpiredEvents() {
    
    let time = moment().utcOffset(-240).format('YYYY-MM-DD HH:mm:ss');
    console.log(time);
    return new Promise((resolve, reject) => {
        db.query(`
            SELECT event_name, server_id, channel_id, event_interval, event_role_id
            FROM events
            WHERE event_time <= ${db.escape(time)}
        `,
        (err, results) => {
            return err ? reject(err) : resolve(results);
        });
    });
}