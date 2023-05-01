const { Events } = require('discord.js');
const sqlActions = require('../sqlActions');

module.exports = {
    name: Events.GuildMemberAdd,
    once: false,
    execute(member) {
        sqlActions.addNewUser(member.user);
        sqlActions.addNewMember(member);
    }
}