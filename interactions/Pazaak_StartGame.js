const pazaak = require('../pazaakSystem');
const { client } = require('../bot');
const { respondToSituation } = require('../gptRespond');

module.exports = {
    interactionID: 'start_game',
    execute: async (interaction) => {

        let foundGame = await pazaak.findGame(interaction);
        if (!foundGame) return;

        if (interaction.user.id == foundGame.player1.id) {
            foundGame.player2.id = client.user.id;
            foundGame.player2.name = "HK47";
            respondToSituation(`You are about to play the card game Pazaak with a user called ${foundGame.player1.name}.` + 
                ` Come up with some trash talk to say to them before the game`, interaction.channel);

        }
        else {
            foundGame.player2.id = interaction.user.id;
            foundGame.player2.name = interaction.member.displayName;
        }

        let gameMessage = await interaction.channel.send({content: "Setting up game..."});

        foundGame.messageId = gameMessage.id;
        foundGame.messageChannelId = gameMessage.channelId;

        interaction.message.delete();

        pazaak.drawCard(foundGame);
    }
}