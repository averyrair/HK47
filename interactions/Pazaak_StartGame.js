const pazaak = require('../pazaakSystem');
const { client } = require('../bot');

module.exports = {
    interactionID: 'start_game',
    execute: async (interaction) => {

        let foundGame = await pazaak.findGame(interaction);
        if (!foundGame) return;

        if (interaction.user.id == foundGame.player1.id) {
            foundGame.player2.id = client.user.id;
            foundGame.player2.name = "HK47";
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