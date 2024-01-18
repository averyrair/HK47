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
    let randomNum = Math.random() * 100;
    //console.log(randomNum);
    if (randomNum < creditsProb) {
        sqlActions.addCredits(message.member, numCredits)
        message.react('1197378388709617826')
        setTimeout(async _ => (await message.reactions.resolve('1197378388709617826')).remove(), 3500)
    }
}

