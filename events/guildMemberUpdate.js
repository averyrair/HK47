const { Events } = require('discord.js');
const sqlActions = require('../sqlActions');

module.exports = {
    name: Events.GuildMemberUpdate,
    once: false,
    execute(oldMember, newMember) {
        sqlActions.updateMember(newMember);
    }
}