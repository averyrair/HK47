const { db } = require('../db');

module.exports.setPazaakCollection = function setPazaakCollection(member, collection) {
    db.query(`
        UPDATE members
        SET pazaak_collection = ${collection}
        WHERE user_id = ${db.escape(member.id)} AND server_id = ${db.escape(member.guild.id)}
    `,
    (err, results) => {
        if (err) throw err;
    });
}