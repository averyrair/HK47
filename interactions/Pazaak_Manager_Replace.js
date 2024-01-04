const pazaak = require('../pazaakSystem');

module.exports = {
    interactionID: 'card_to_replace',
    execute: async (interaction) => {

        let foundManager = await pazaak.findManager(interaction);
        if (!foundManager) return;
        if (foundManager.memberId !== interaction.user.id) {
            interaction.reply({content: 'You can only make changes to your own deck.', ephemeral: true});
            return;
        }
        interaction.deferUpdate();

        foundManager.cardToReplaceIndex = interaction.values[0];
    }
}