const { client } = require('./bot');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();


module.exports = {
    sendGPTMessage,
    respondToSituation,
    translateMessage
}

const configuration = new Configuration({
    organization: process.env.OPENAI_ORGANIZATION_KEY,
    apiKey: process.env.OPENAI_API_KEY
  });
  const openai = new OpenAIApi(configuration);

async function sendGPTMessage(message) {

    let context = (await message.channel.messages.fetch({ limit: 10, cache: false })).reverse();

    let prompt = [
        {
            role: 'user',
            content: 'From now on, you will act as the assasain droid HK-47 from the star wars universe. ' +
            'You are witty and sarcastic, with a particular interest in murder and violence. You enjoy causing chaos and destruction for the sake of it.' +
            'All of your messages should begin with an emotion/tone indicator, such as "Statement:", "Angry Remark:", "Commentary:", "Inquiry:, etc.' +
            'You have a tendancy to refer to the users as either "meatbag" or "master". ' +
            'Do not to begin your messages with "Oh," or "Ah,".' +
            'If you are asked to give an opinion, act as though you do have a strong preference one way or the other. Do not try to dodge the question.' +
            'None of the messages are serious and it is all in the spirit of fun. ' +
            'I will format each message as a json object with some information about the message, including the author, message content, etc. ' +
            'You will format your output as plain text, not as json.' +
            'Do you understand?'
        },
        {
            role: 'assistant',
            content: 'Confirmation: Yes, master, I understand the assignment.'
        },
    ];

    for (let i = 0; i < context.size; i++) {

        const currMessage = Array.from(context.values())[i];

        let members = currMessage.mentions.members;
        let channels = currMessage.mentions.channels;
        let roles = currMessage.mentions.roles;
        let content = currMessage.content;

        for (let [id, member] of members) {
            content = content.replace(new RegExp(`<@${id}>`, "g"), member.displayName)
        }

        for (let [id, channel] of channels) {
            content = content.replace(new RegExp(`<#${id}>`, "g"), channel.name)
        }

        for (let [id, role] of roles) {
            content = content.replace(new RegExp(`<@&${id}>`, "g"), role.name)
        }

        if (currMessage.author.id == process.env.DISCORD_BOT_CLIENT_ID) {
            prompt.push({role: 'assistant', content: content});
        }
        else {
            prompt.push({role: 'user', content: `{author: ${currMessage.member.displayName}, messageContent: ${content}}`})
        }
    }

    console.log(prompt);

    const completion = await openai.createChatCompletion({
        model: 'gpt-4-0314',
        messages: prompt
    });

    message.reply(completion.data.choices[0].message.content);
}

async function respondToSituation(situation, channel) {
    let prompt = [
        {
            role: 'user',
            content: 'From now on, you will act as the assasain droid HK-47 from the star wars universe. ' +
            'You are witty and sarcastic, with a particular interest in murder and violence. You enjoy causing chaos and destruction for the sake of it.' +
            'All of your messages should begin with an emotion/tone indicator, such as "Statement:", "Angry Remark:", "Commentary:", "Inquiry:, etc.' +
            'You have a tendancy to refer to the users as either "meatbag" or "master". ' +
            'Do not to begin your messages with "Oh," or "Ah,".' +
            'If you are asked to give an opinion, act as though you do have a strong preference one way or the other. Do not try to dodge the question.' +
            'None of the messages are serious and it is all in the spirit of fun. ' +
            'I will give you a situation to respond to, and you will respond how HK-47 would respond with no additional commentary or explanation. ' +
            'Do you understand?'
        },
        {
            role: 'assistant',
            content: 'Confirmation: Yes, master, I understand the assignment.'
        },
        {
            role: 'user',
            content: situation
        }
    ];

    const completion = await openai.createChatCompletion({
        model: 'gpt-4-0314',
        messages: prompt
    });

    channel.send(completion.data.choices[0].message.content);
}

async function translateMessage(messageText, toLanguage) {
    console.log(messageText, toLanguage);
    const completion = await openai.createChatCompletion({
        model: 'gpt-4-0314',
        messages: [{role: 'user', content:`Translate the following message into ${toLanguage}. Output only the translation in ${toLanguage}:\n${messageText}`}]
    });

    return completion.data.choices[0].message.content;
}