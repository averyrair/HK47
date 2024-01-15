const pazaak = require('../pazaakSystem');
const sqlActions = require('../sqlActions');
const { respondToSituation } = require('../gptRespond');
const { client } = require('../bot');

module.exports = {
    interactionID: 'start_game',
    execute: async (interaction) => {

        let foundGame = await pazaak.findGame(interaction);
        if (!foundGame) {
            interaction.reply({content: 'This game is expired', ephemeral: true});
            return;
        }

        let singlePlayer = interaction.user.id === foundGame.player1.id;

        if (!singlePlayer) {
            let availableCredits = (await sqlActions.getMember(interaction.member)).credits
            if (availableCredits < foundGame.wager) {
                interaction.reply({content: (await respondToSituation(
                    `${interaction.member.displayName} is attempting to wager credits on a` +
                    ` game of Pazaak but they tried to wager more credits than they have. ` +
                    `Make fun of them for it.`
                )),
                ephemeral:true});
            
                return;
            }
        }

        let gameMessage = await interaction.channel.send({content: "Setting up game..."});

        foundGame.player2.id = (singlePlayer) ? client.user.id : interaction.user.id;
        foundGame.player2.name = (singlePlayer) ? "HK47" : interaction.member.displayName;

        foundGame.messageId = gameMessage.id;
        foundGame.messageChannelId = gameMessage.channelId;

        let guild = (await client.channels.fetch(foundGame.messageChannelId)).guild
        let player1Member = await guild.members.fetch(foundGame.player1.id);

        let player1SideDeckStr = (await sqlActions.getMember(player1Member)).pazaak_sidedeck;
        let player2SideDeckStr = ''
        if (!singlePlayer) {
            player2SideDeckStr = (await sqlActions.getMember(interaction.member)).pazaak_sidedeck;
        }
        
        let player1SideDeck = [];
        let player2SideDeck = [];

        let player1Hand = [];
        let player2Hand = [];

        for (let i = 0; i < 10; i++) {
            player1SideDeck.push(player1SideDeckStr.substring(i*2, (i*2)+2));
            if (!singlePlayer) {
                player2SideDeck.push(player2SideDeckStr.substring(i*2, (i*2)+2));
            }
        }
        for (let i = 0; i < 4; i++) {
            let cardIndex1 = Math.floor(Math.random()*player1SideDeck.length);
            player1Hand.push(player1SideDeck[cardIndex1]);
            player1SideDeck.splice(cardIndex1, 1);

            if (!singlePlayer) {
                let cardIndex2 = Math.floor(Math.random()*player2SideDeck.length);
                player2Hand.push(player2SideDeck[cardIndex2]);
                player2SideDeck.splice(cardIndex2, 1);
            }
        }

        if (singlePlayer) {
            player2Hand = getHKHand();
        }

        foundGame.player1.hand = player1Hand;
        foundGame.player2.hand = player2Hand;

        interaction.message.delete();

        pazaak.drawCard(foundGame);
    }
}

function getHKHand() {
    let hand = [];
    for (let i = 0; i < 4; i++) {
        let card = ''
        let randSuit = Math.floor(Math.random() * 3);
        if (randSuit === 0) {
            card = 'B';
        }
        else if (randSuit === 1) {
            card = 'R';
        }
        else {
            card = 'P';
        }
        card += Math.floor(Math.random() * 6) + 1
        hand.push(card);
    }
    return hand;
}