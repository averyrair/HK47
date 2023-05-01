const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const sqlActions = require('../sqlActions');
const { db } = require('../db');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('view-events')
        .setDescription('Show all events for this server.'),
	async execute(interaction) {
		let events = await sqlActions.getServerEvents(interaction.guild);
        let msg = (events.length == 0) ? 'There are no events scheduled.' : '';
        for (e of events) {
            msg += `${e.event_name} will happen on ${e.time} in <#${e.channel_id}> ${(e.event_role_id) ? `for <@&${e.event_role_id}>` : ''}\n`;
        }
        
        let viewEventsEmbed = new EmbedBuilder()
        .setColor(0x533c61)
        .setTitle(`Events for ${interaction.guild.name}`)
        .addFields(
            {name: '⠀' ,value: msg},
        )
        .setTimestamp();

        interaction.reply({content: '', embeds: [viewEventsEmbed]});
	},
};