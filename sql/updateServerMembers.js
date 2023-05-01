const { db } = require('../db');
const addNewUser = require('./addNewUser').addNewUser;
const addNewMember = require('./addNewMember').addNewMember;
const updateUser = require('./updateUser').updateUser;
const updateMember = require('./updateMember').updateMember;

module.exports.updateServerMembers = async function updateServerMembers(server) {
    members = Array.from(await server.members.fetch(), x => x[1]);
    members.forEach((member) => {
        addNewUser(member.user);
        updateUser(member.user);

        addNewMember(member);
        updateMember(member);
    });
}