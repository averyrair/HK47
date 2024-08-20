const { Events } = require('discord.js');
const sqlActions = require('../sqlActions');
const xpSystem = require('../xpSystem');
const currencySystem = require('../currencySystem')
const { client } = require('../bot');
const { sendGPTMessage, gptHelloThere, respondToSituation } = require('../gptRespond');
const Sentiment = require('sentiment');

module.exports = {
    name: Events.MessageCreate,
    once: false,
    async execute(message) {

        bannedChannels = await sqlActions.getBannedChannels(message.guild);
        if (message.author.bot || bannedChannels.filter(e => e.channel_id == message.channel.id).length > 0) {
            return;
        }

        if (message.guild.id == '829382503767867392') {
            const sentiment = await getChannelSentiment(message.channel);
            if (sentiment < -0.5) {
                prompt = `I will provide the logs that `
                    + `might be an argument. If it is, jump into `
                    + `the argument and mock the argument. If it is not an argument, `
                    + `try to start one based on the current conversation. Don't `
                    + `start your messages with your name. That is only there so you `
                    + `have context for who is speaking. Here is the log:\n`
                
                const context = (await message.channel.messages.fetch({ limit: 10, cache: false })).reverse();
                for (msg of Array.from(context.values())) {
                    prompt += `${msg.member.displayName}: ${msg.content}\n`
                }
                const response = await respondToSituation(prompt);
                message.channel.send(response);
            }
        }

        if (message.mentions.has(client.user)) {
            sendGPTMessage(message);
        }
        
        currencySystem.giveCredits(message);
        xpSystem.messageSent(message);
        
    }
}

async function getChannelSentiment(channel) {
    const context = (await channel.messages.fetch({ limit: 5, cache: false })).reverse();
    const messageArray = Array.from(context.values());
    const sentiment = new Sentiment();
    let totalScore = 0
    for (msg of messageArray) {
        const score = sentiment.analyze(msg.content).comparative;
        totalScore += score;
    }
    return totalScore / messageArray.length
}