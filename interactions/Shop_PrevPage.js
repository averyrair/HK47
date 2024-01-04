const { prevPage } = require('../shopSystem');

module.exports = {
    interactionID: 'prev_page',
    execute: async (interaction) => {
        prevPage(interaction);
    }
}