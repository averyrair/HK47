const sqlActions = require('./sqlActions');
const { client } = require('./bot');
const xpSystem = require('./xpSystem');
const { EmbedBuilder } = require('discord.js')

module.exports = {
    handleExpiredEvents,
}

async function handleExpiredEvents() {

    let events = await sqlActions.getExpiredEvents();
    events.forEach(async (event) => {
        let eventChannel = await client.channels.fetch(event.channel_id);
        let eventServer = await client.guilds.fetch(event.server_id);

        if (event.event_name == 'scoreboard') {
            xpSystem.resolveScoreboard(eventChannel, eventServer);
        }
        else {

            let eventStartingEmbed = new EmbedBuilder()
            .setColor(0x533c61)
            .setTitle(`Event Starting!`)
            .addFields(
                {name: event.event_name ,value: 'is starting now.'},
            )
            .setTimestamp();
    
            eventChannel.send({content: (event.event_role_id) ? `<@&${event.event_role_id}>` : '', embeds: [eventStartingEmbed]});

            if (event.event_interval) {
                sqlActions.advanceInterval(event);
            }
            else sqlActions.deleteEvent(eventServer, event.event_name);
        }

    });
}