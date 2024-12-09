const { SlashCommandBuilder } = require('discord.js');
const { respondToSituation } = require('../gptRespond')

module.exports = {
	data: new SlashCommandBuilder()
        .setName('summarize')
        .setDescription('Summarizes the recent conversation')
        .addIntegerOption(option =>
            option.setName('minutes')
                    .setDescription('how far back to summarize in minutes')
                    .setRequired(true)
                    .setMinValue(0)
                    .setMaxValue(24*60)
        ),
	async execute(interaction) {
        interaction.deferReply();
        messages = await getRecentMessages(interaction);
        prompt = "You will summarize the following conversation. " +
            "Feel free to insert sarcastic remarks or commentary, but do not " +
            "compromise the accuracy of the summary. It should be a useful summary" +
            "Here is the conversation:\n\n"
        for (message of messages) {
            prompt += `${message.member.displayName}: ${message.content}\n\n`
        }
        interaction.editReply(await respondToSituation(prompt)) 
	},
};

async function getRecentMessages(interaction) {

        const timeThreshold = Date.now() - interaction.options.getInteger('minutes') * 60 * 1000;
        const recentMessages = [];
        const channel = interaction.channel
        if (!channel || !channel.isTextBased()) {
            interaction.reply({content: "This command cannot be used here", ephemeral: true})
        }
        let lastMessageId;
       

        while (true) {
            // Fetch the next batch of messages after the last message
            const options = { limit: 100 };
            if (lastMessageId) {
                options.before = lastMessageId;
            }

            const messages = await channel.messages.fetch(options);
            if (messages.size === 0) break; // No more messages to fetch

            for (const message of messages.values()) {
                if (message.createdTimestamp < timeThreshold) {
                    // Stop if the message is older than the time threshold
                    return recentMessages.sort((a, b) => a.createdTimestamp - b.createdTimestamp);
                }
                recentMessages.push(message); // Add the message to the array
                lastMessageId = message.id; // Update the last message ID
            }
        } 
}