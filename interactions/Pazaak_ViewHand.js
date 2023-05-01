const pazaak = require('../pazaakSystem');

module.exports = {
    interactionID: 'view_hand',
    execute: async (interaction) => {

        let foundGame = await pazaak.findGame(interaction);
        if (!foundGame) return;

        interaction.reply(pazaak.renderHand(foundGame, interaction));
    }
}