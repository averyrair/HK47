const { nextPage } = require('../shopSystem');

module.exports = {
    interactionID: 'next_page',
    execute: async (interaction) => {
        nextPage(interaction);
    }
}