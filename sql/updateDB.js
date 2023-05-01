const { client } = require('../bot');
const addNewServer = require('./addNewServer').addNewServer;
const updateServer = require('./updateServer').updateServer;
const updateServerMembers = require('./updateServerMembers').updateServerMembers;

module.exports.updateDB = async function updateDB() {

    servers = Array.from(await client.guilds.fetch(), x => x[1]);
    servers.forEach(async (server) => {
        server = await server.fetch();
        addNewServer(server);
        updateServer(server);
        updateServerMembers(server);
    });
    console.log('database up to date...');
}