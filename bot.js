const Discord = require('discord.js');
require('dotenv').config();

//discord client setup
module.exports = {
    client: new Discord.Client({
        intents: [
            Discord.GatewayIntentBits.Guilds, 
            Discord.GatewayIntentBits.GuildMessages, 
            Discord.GatewayIntentBits.MessageContent, 
            Discord.GatewayIntentBits.GuildMembers
        ]
    })
}