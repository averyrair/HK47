const { Events } = require('discord.js');
const sqlActions = require('../sqlActions');

module.exports = {
    name: Events.UserUpdate,
    once: false,
    execute(oldUser, newUser) {
        sqlActions.updateUser(newUser);
    }
}