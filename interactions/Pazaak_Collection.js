const pazaak = require('../pazaakSystem');

module.exports = {
    interactionID: 'manage_pazaak',
    execute: async (interaction) => {

        if (interaction.message.interaction.user.id !== interaction.user.id) {
            interaction.reply({content: 'Only the person who issued the original command can use this button.', ephemeral: true});
            return;
        }
        let manager = pazaak.createCardManager(interaction);
        interaction.update(await pazaak.renderCollection(manager));
    }
}