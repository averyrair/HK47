const { db } = require('../db');

module.exports.getBannedChannels = function getBannedChannels(server) {
    return new Promise((resolve, reject) => {
        db.query(`
            SELECT channel_id
            FROM \`banned channels\`
            WHERE server_id = ${db.escape(server.id)}
        `,
        (err, results) => {
            return err ? reject(err) : resolve(results);
        });
    });
}