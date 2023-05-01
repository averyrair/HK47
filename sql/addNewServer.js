const { db } = require('../db');
const addNewUser = require('./addNewUser').addNewUser;
const addNewMember = require('./addNewMember').addNewMember;

module.exports.addNewServer = function addNewServer (server) {
    db.query(`
        INSERT INTO servers (server_id, server_name)
        SELECT ${db.escape(server.id)}, ${db.escape(server.name)}
        WHERE NOT EXISTS (SELECT * FROM servers WHERE server_id = ${db.escape(server.id)})
        LIMIT 1
        `,
    async (err, results) => {
        if (err) throw err;
        if (results.affectedRows != 0) {
            members = Array.from(await server.members.fetch(), x => x[1]);
            members.forEach((member) => {
                addNewUser(member.user);
                addNewMember(member);
            });
        }
    });
}