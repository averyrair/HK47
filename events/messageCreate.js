const { Events } = require('discord.js');
const sqlActions = require('../sqlActions');
const xpSystem = require('../xpSystem');
const { client } = require('../bot');
const { sendGPTMessage, gptHelloThere } = require('../gptRespond');

module.exports = {
    name: Events.MessageCreate,
    once: false,
    async execute(message) {

        bannedChannels = await sqlActions.getBannedChannels(message.guild);
        if (message.author.bot || bannedChannels.filter(e => e.channel_id == message.channel.id).length > 0) {
            return;
        }

        if (message.mentions.has(client.user)) {
            sendGPTMessage(message);
        }
        
        xpSystem.messageSent(message);
        
    }
}