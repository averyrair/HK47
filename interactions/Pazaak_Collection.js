const pazaak = require('../pazaakSystem');

module.exports = {
    interactionID: 'manage_pazaak',
    execute: async (interaction) => {

        interaction.update(await pazaak.renderCollection(interaction));
    }
}