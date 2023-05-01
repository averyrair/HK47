const { Events } = require('discord.js');
const sqlActions = require('../sqlActions');

module.exports = {
    name: Events.GuildCreate,
    once: false,
    execute(server) {
        sqlActions.addNewServer(server);
    }
}