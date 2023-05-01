const { db } = require('../db');

module.exports.addScoreChannel = function addScoreChannel(channel) {
    db.query(`
        INSERT INTO scoreboards (channel_id, server_id, place)
        SELECT
            ${db.escape(channel.id)},
            ${db.escape(channel.guild.id)},
            ((SELECT COUNT(*) FROM scoreboards WHERE server_id = ${db.escape(channel.guild.id)}) + 1)
        WHERE NOT EXISTS
            (SELECT * FROM scoreboards WHERE channel_id = ${db.escape(channel.id)})
        LIMIT 1;
    `,
    (err, results) => {
        if (err) throw err;
    });
}