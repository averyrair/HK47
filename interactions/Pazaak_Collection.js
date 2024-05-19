const pazaak = require('../pazaakSystem');

module.exports = {
    interactionID: 'manage_pazaak',
    execute: async (interaction) => {

        let userID = null;
        if (interaction.message.interaction) {
            userID = interaction.message.interaction.user.id;
        }
        else {
            let channel = interaction.channel;
            userID = (await channel.messages.fetch(interaction.message.reference.messageId)).user.id;
        }

        if (userID !== interaction.user.id) {
            interaction.reply({content: 'Only the person who issued the original command can use this button.', ephemeral: true});
            return;
        }
        let manager = pazaak.createCardManager(interaction);
        interaction.update(await pazaak.renderCollection(manager));
    }
}