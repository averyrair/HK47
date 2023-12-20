const sqlActions = require('./sqlActions');
const { client } = require('./bot');
const { cooldowns } = require('./xpSystem')

module.exports = {
    giveCredits
}

async function giveCredits(message) {

    if (cooldowns.has(message.member)) {
        return
    }

    let creditsProb = await sqlActions.getCreditsProb(message.guild)
    let numCredits = await sqlActions.getCreditsPay(message.guild)
    if ((Math.random() * 100) < creditsProb) {
        sqlActions.addCredits(message.member, numCredits)
        message.react('1186794130098114600')
    }
}

