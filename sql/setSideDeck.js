const { db } = require('../db');

module.exports.setPazaakSideDeck = function setPazaakSideDeck(member, sidedeck) {
    db.query(`
        UPDATE members
        SET pazaak_sidedeck = ${db.escape(sidedeck)}
        WHERE user_id = ${db.escape(member.id)} AND server_id = ${db.escape(member.guild.id)}
    `,
    (err, results) => {
        if (err) throw err;
    });
}