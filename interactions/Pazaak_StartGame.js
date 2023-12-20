const pazaak = require('../pazaakSystem');
const sqlActions = require('../sqlActions');
const { respondToSituation } = require('../gptRespond');

module.exports = {
    interactionID: 'start_game',
    execute: async (interaction) => {

        let foundGame = await pazaak.findGame(interaction);
        if (!foundGame) return;

        if (interaction.user.id == foundGame.player1.id) {
            interaction.reply({content: "Solo play is not yet supported.", ephemeral: true});
            return;
        }

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

        let gameMessage = await interaction.channel.send({content: "Setting up game..."});

        foundGame.player2.id = interaction.user.id;
        foundGame.player2.name = interaction.member.displayName;

        foundGame.messageId = gameMessage.id;
        foundGame.messageChannelId = gameMessage.channelId;

        interaction.message.delete();

        pazaak.drawCard(foundGame);
    }
}