const pazaak = require('../pazaakSystem');

module.exports = {
    interactionID: 'abort',
    execute: async (interaction) => {

        let foundGame = await pazaak.findGame(interaction);
        if (!foundGame) return;

        if (interaction.user.id != foundGame.player1.id) {
            interaction.reply({
                content: "You cannot abort a game you did not start.",
                ephemeral: true
            });
        }

        foundGame.gameOver = true;
        sqlActions.addCredits(interaction.member, foundGame.wager);
        interaction.message.delete();
    }
}
