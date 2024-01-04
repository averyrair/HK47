const { buyItem } = require('../shopSystem');

module.exports = {
    interactionID: 'buy_item',
    execute: async (interaction) => {

        buyItem(interaction);
    }
}