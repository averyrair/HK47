const pazaak = require('../pazaakSystem');

module.exports = {
    interactionID: 'manage_pazaak',
    execute: async (interaction) => {

        let manager = pazaak.createCardManager(interaction);
        interaction.update(await pazaak.renderCollection(manager));
    }
}