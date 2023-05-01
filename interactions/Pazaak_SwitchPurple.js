const pazaak = require('../pazaakSystem');

module.exports = {
    interactionID: 'switch_purple',
    execute: async (interaction) => {

        let foundGame = await pazaak.findGame(interaction);
        if (!foundGame) return;

        pazaak.flipPurple(foundGame, interaction);
    }
}