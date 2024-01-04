const { selectItem } = require('../shopSystem');

module.exports = {
    interactionID: 'shop_dropdown',
    execute: async (interaction) => {
        let itemNum = parseInt(interaction.values[0]);

        selectItem(interaction, itemNum);
    }
}