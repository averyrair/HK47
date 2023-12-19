const sqlActions = require('./sqlActions');
const { client } = require('./bot');
const { cooldowns } = require('./xpSystem')

module.exports = {
    giveCredits
}

function giveCredits(message) {

    if (cooldowns.has(message.member)) {
        return
    }

    const CREDITS_CHANCE = 20
    const NUM_CREDITS = 50
    if ((Math.random() * 100) < CREDITS_CHANCE) {
        sqlActions.addCredits(message.member, NUM_CREDITS)
        message.react('1186794130098114600')
    }
}