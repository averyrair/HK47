const pazaak = require('../pazaakSystem');

module.exports = {
    interactionID: 'forfeit',
    execute: async (interaction) => {

        let foundGame = await pazaak.findGame(interaction);
        if (!foundGame) return;

        if (interaction.user.id == foundGame.player1.id) {
            foundGame.player1.lost = true;
            interaction.deferUpdate();
            pazaak.endRound(foundGame);
        }
        else if (interaction.user.id == foundGame.player2.id) {
            foundGame.player2.lost = true;
            interaction.deferUpdate();
            pazaak.endRound(foundGame);
        }
        else {
            interaction.reply({
                content: "You cannot forfeit a game you are not playing in.",
                ephemeral: true
            });
        }
    }
}
