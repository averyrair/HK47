const pazaak = require('../pazaakSystem');
const { getProfileEmbed } = require('../commands/profile');

module.exports = {
    interactionID: 'back',
    execute: async (interaction) => {

        if (interaction.message.interaction.user.id !== interaction.user.id) {
            interaction.reply({content: 'Only the person who issued the original command can go back.', ephemeral: true});
            return;
        }
        interaction.update(await getProfileEmbed(interaction));
    }
}