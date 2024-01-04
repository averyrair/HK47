const pazaak = require('../pazaakSystem');

module.exports = {
    interactionID: 'swap_cards',
    execute: async (interaction) => {

        let foundManager = await pazaak.findManager(interaction);
        if (!foundManager) return;
        if (foundManager.memberId !== interaction.user.id) {
            interaction.reply({content: 'You can only make changes to your own deck.', ephemeral: true});
            return;
        }

        await pazaak.swapSideDeckCards(foundManager);
        interaction.update(await pazaak.renderCollection(foundManager))
    }
}