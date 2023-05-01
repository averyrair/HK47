const { Events } = require('discord.js');
const sqlActions = require('../sqlActions');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute() {
        console.log('Irritated Statement: Yes, Yes, I am online, master.');
        sqlActions.updateDB();
    }
}