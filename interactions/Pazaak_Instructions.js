const pazaak = require('../pazaakSystem');

module.exports = {
    interactionID: 'instructions',
    execute: async (interaction) => {

        let foundGame = await pazaak.findGame(interaction);
        if (!foundGame) return;

        interaction.reply({
            content: `**How to Play Pazaak**\n ` + 
            `> In Pazaak, your goal is to get a score as close to 20 as possible without going over.\n ` +
            `> At the start of your turn, a green card will be drawn from the deck and played on your board, adding to your score. ` +
            `You can then do one of 3 things.\n > **Play a Card:** you can play a card from your hand of 4 cards to alter your score. ` +
            `Blue cards are positive, red cards are negative, and cards with both blue and red can be played as either. ` + 
            `You can only play one card per turn.\n > **End Turn:** This simply ends your turn without having played a card. ` +
            `If you are over 20 when you end your turn, you bust and lose the round.\n ` +
            `> **Stand:** Once you are happy with your score, hit stand to lock it in. ` + `
            Your opponent can keep playing cards until they either stand or bust, but your turn will be skipped until then.\n ` + `
            > Once either both players have hit stand or as soon as one player busts, the round ends. ` + `
            Whoever has the highest score without going over 20 wins the round. The first to win 3 rounds wins the game. ` + `
            Note: your hand does not refresh between rounds. You have to make your 4 cards last the entire game.`,
            ephemeral: true
        });
    }
}