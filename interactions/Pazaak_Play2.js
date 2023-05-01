const pazaak = require('../pazaakSystem');

module.exports = {
    interactionID: 'play_2',
    execute: async (interaction) => {

        let foundGame = await pazaak.findGame(interaction);
        if (!foundGame) return;

        if (!pazaak.isActivePlayer(foundGame, interaction.user)) {
            interaction.reply({content: "It is not your turn.", ephemeral: true});
            return;
        }
        pazaak.playCard(2, foundGame, interaction);
    }
}