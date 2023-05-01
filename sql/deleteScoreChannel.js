const { db } = require('../db');
const getScoreChannels = require('./getScoreChannels').getScoreChannels;

module.exports.deleteScoreChannel = async function deleteScoreChannel(server) {
    let channels = await getScoreChannels(server);
    let lastChannel = channels[channels.length - 1];

    db.query(`
        DELETE FROM scoreboards WHERE channel_id = ${db.escape(lastChannel.channel_id)}
    `,
    (err, results) => {
        if (err) throw err;
    });

}