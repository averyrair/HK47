const { EmbedBuilder } = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { client } = require('./bot');
const { respondToSituation } = require ('./gptRespond');

module.exports = {
    startGame,
    renderBoard,
    endTurn,
    drawCard,
    stand,
    endRound,
    resetBoards,
    renderHand,
    playCard,
    placeCard,
    flipPurple,
    isActivePlayer,
    findGame,
}

let pazaakGames = [];

const symbols = new Map([
    ["E", "<:pazaak_empty:892834795770490972>"],
    ["G1", "<:pazaak_green_1:892834496511086602>"],
    ["G2", "<:pazaak_green_2:892834496548864062>"],
    ["G3", "<:pazaak_green_3:892834496561430589>"],
    ["G4", "<:pazaak_green_4:892834496217509909>"],
    ["G5", "<:pazaak_green_5:892834501116444742>"],
    ["G6", "<:pazaak_green_6:892834501212921876>"],
    ["G7", "<:pazaak_green_7:892834501384876103>"],
    ["G8", "<:pazaak_green_8:892834501221298206>"],
    ["G9", "<:pazaak_green_9:892834501326172190>"],
    ["G10", "<:pazaak_green_10:892834501439389696>"],
    ["B1", "<:pazaak_blue_1:894706597782257705>"],
    ["B2", "<:pazaak_blue_2:894706597845151864>"],
    ["B3", "<:pazaak_blue_3:894706597899698277>"],
    ["B4", "<:pazaak_blue_4:894706597887090830>"],
    ["B5", "<:pazaak_blue_5:894706598071631883>"],
    ["B6", "<:pazaak_blue_6:894706597572513823>"],
    ["R1", "<:pazaak_red_1:894706597991948339>"],
    ["R2", "<:pazaak_red_2:894706597761273898>"],
    ["R3", "<:pazaak_red_3:894706598017122424>"],
    ["R4", "<:pazaak_red_4:894706597606076437>"],
    ["R5", "<:pazaak_red_5:894706597731909725>"],
    ["R6", "<:pazaak_red_6:894706598113607740>"],
    ["P1", "<:pazaak_purple_1:894706597765480490>"],
    ["P2", "<:pazaak_purple_2:894706598046470194>"],
    ["P3", "<:pazaak_purple_3:894706598021328927>"],
    ["P4", "<:pazaak_purple_4:894706597673205831>"],
    ["P5", "<:pazaak_purple_5:894706598038097990>"],
    ["P6", "<:pazaak_purple_6:894706597970984991>"],
    ["C0", "<:card_indicator_0:1062076667985670246>"],
    ["C1", "<:card_indicator_1:1062074642061348905>"],
    ["C2", "<:card_indicator_2:1062074643428675705>"],
    ["C3", "<:card_indicator_3:1062074644661813359>"],
    ["C4", "<:card_indicator_4:1062074646951903394>"]
]);

const greenDeck = ["G1", "G2", "G3", "G4", "G5", "G6", "G7", "G8", "G9", "G10"];
const sideDeck = ["B1", "B2", "B3", "B4", "B5", "B6", "R1", "R2", "R3", "R4", "R5", "R6", "P1", "P2", "P3", "P4", "P5", "P6"];

async function startGame(interaction) {
    let player1Hand = [];
    for (let i = 0; i < 4; i++) {
        player1Hand[i] = sideDeck[Math.floor(Math.random()*sideDeck.length)];
    }
    let player2Hand = [];
    for (let i = 0; i < 4; i++) {
        player2Hand[i] = sideDeck[Math.floor(Math.random()*sideDeck.length)];
    }
    

    let gameState = {
        messageId: null,
        messageChannelId: null,
        turn: 1,
        gameOver: false,
        cardPlayed: false,
        roundNumber: 0,
        player1: {
            id: interaction.user.id,
            name: interaction.member.displayName,
            roundsWon: 0,
            score: 0,
            standing: false,
            lost: false,
            purpleState: "positive",
            filledSpaces: 0,
            cardsLeft: 4,
            hand: player1Hand,
            boardState: [
                "E", "E", "E",
                "E", "E", "E",
                "E", "E", "E"
            ]
        },
        player2: {
            id: null,
            roundsWon: 0,
            score: 0,
            standing: false,
            lost: false,
            purpleState: "positive",
            filledSpaces: 0,
            cardsLeft: 4,
            hand: player2Hand,
            boardState: [
                "E", "E", "E",
                "E", "E", "E",
                "E", "E", "E"
            ]
        },
    };

    const buttonRow = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('start_game')
                .setLabel('Start')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('instructions')
                .setLabel('How to Play')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('abort')
                .setLabel('Abort')
                .setStyle(ButtonStyle.Secondary),
        );

    let pazaakEmbed = new EmbedBuilder()
        .setColor(0xb078ff)
        .setTitle('Pazaak Beta')
        .addFields(
            {name: `Press Start to Join Game` ,value: `opponent: ${interaction.member.displayName}`}
        )
        .setTimestamp();

    let pazaakMessage = {
        embeds: [pazaakEmbed],
        components: [buttonRow],
        fetchReply: true
    };

    let gameMessage = await interaction.reply(pazaakMessage);

    gameState.messageId = gameMessage.id;
    gameState.messageChannelId = gameMessage.channelId;

    pazaakGames.push(gameState);
}

function renderBoard(gameState) {

    let player1Board = ``;
    switch (gameState.player1.roundsWon) {
        case 0:
            player1Board += "⚪⚪⚪\n"
            break;
        case 1:
            player1Board += "🔴⚪⚪\n"
            break;
        case 2:
            player1Board += "🔴🔴⚪\n"
            break;
        default:
            player1Board += "🔴🔴🔴\n"
            break;
    }

    player1Board += symbols.get(gameState.player1.boardState[0]);
    player1Board += symbols.get(gameState.player1.boardState[1]);
    player1Board += symbols.get(gameState.player1.boardState[2]) + "\n";
    player1Board += symbols.get(gameState.player1.boardState[3]);
    player1Board += symbols.get(gameState.player1.boardState[4]);
    player1Board += symbols.get(gameState.player1.boardState[5]) + "\n";
    player1Board += symbols.get(gameState.player1.boardState[6]);
    player1Board += symbols.get(gameState.player1.boardState[7]);
    player1Board += symbols.get(gameState.player1.boardState[8]) + "\n";
    switch (gameState.player1.cardsLeft) {
        case 0:
            player1Board += symbols.get("C0")
            break;
        case 1:
            player1Board += symbols.get("C1")
            break;
        case 2:
            player1Board += symbols.get("C2")
            break;
        case 3:
            player1Board += symbols.get("C3")
            break;
        case 4:
            player1Board += symbols.get("C4")
        default:
            break;
    }
    if (gameState.turn == 1) player1Board += "⬆️";
    if (gameState.player1.standing == true) player1Board += "🚩";


    let player2Board = ``;
    switch (gameState.player2.roundsWon) {
        case 0:
            player2Board += "⚪⚪⚪\n"
            break;
        case 1:
            player2Board += "🔴⚪⚪\n"
            break;
        case 2:
            player2Board += "🔴🔴⚪\n"
            break;
        default:
            player2Board += "🔴🔴🔴\n"
            break;
    }

    player2Board += symbols.get(gameState.player2.boardState[0]);
    player2Board += symbols.get(gameState.player2.boardState[1]);
    player2Board += symbols.get(gameState.player2.boardState[2]) + "\n";
    player2Board += symbols.get(gameState.player2.boardState[3]);
    player2Board += symbols.get(gameState.player2.boardState[4]);
    player2Board += symbols.get(gameState.player2.boardState[5]) + "\n";
    player2Board += symbols.get(gameState.player2.boardState[6]);
    player2Board += symbols.get(gameState.player2.boardState[7]);
    player2Board += symbols.get(gameState.player2.boardState[8]) + "\n";
    switch (gameState.player2.cardsLeft) {
        case 0:
            player2Board += symbols.get("C0")
            break;
        case 1:
            player2Board += symbols.get("C1")
            break;
        case 2:
            player2Board += symbols.get("C2")
            break;
        case 3:
            player2Board += symbols.get("C3")
            break;
        case 4:
            player2Board += symbols.get("C4")
        default:
            break;
    }
    if (gameState.turn == 2) player2Board += "⬆️";
    if (gameState.player2.standing == true) player2Board += "🚩";


    const buttonRow = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('end_turn')
                .setLabel('End Turn')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('stand')
                .setLabel('Stand')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('view_hand')
                .setLabel('View Hand')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('forfeit')
                .setLabel('Forfeit')
                .setStyle(ButtonStyle.Secondary),
        );



    let pazaakEmbed = new EmbedBuilder()
        .setColor(0xb078ff)
        .setTitle('Pazaak Beta')
        .addFields(
            {name: `${gameState.player1.name}: ${gameState.player1.score}` ,value: player1Board, inline: true},
            {name: `${gameState.player2.name}: ${gameState.player2.score}`, value: player2Board, inline: true}
        )
        .setTimestamp();

    let pazaakMessage = {content: "", embeds: [pazaakEmbed], components: [buttonRow], fetchReply: true};

    return pazaakMessage;
}

function endTurn(gameState) {

    if (gameState.player1.standing && gameState.player2.standing) {
        endRound(gameState);
        return;
    }
    else if (gameState.player1.score > 20 || gameState.player2.score > 20) {
        endRound(gameState);
        return;
    }
    else if (gameState.player1.filledSpaces == 9 || gameState.player2.filledSpaces == 9) {
        endRound(gameState);
        return;
    }

    if (gameState.turn == 1 && !gameState.player2.standing) gameState.turn = 2;
    else if (!gameState.player1.standing) gameState.turn = 1;

    gameState.cardPlayed = false;

    drawCard(gameState);

    const newActivePlayer = gameState.turn === 1 ? gameState.player1 : gameState.player2;
    if (newActivePlayer.id === client.user.id) {
        setTimeout(function() {takeAITurn(gameState)}, 1500);
    }
}

function drawCard(gameState) {

    let randNum = Math.floor(Math.random()*greenDeck.length);
    let newCard = greenDeck[randNum];

    if (gameState.turn == 1) gameState.player1.score += randNum + 1;
    else gameState.player2.score += randNum + 1;

    placeCard(gameState, newCard);
}

function stand(gameState) {
    if (gameState.turn == 1) {
        gameState.player1.standing = true;
    }
    else {
        gameState.player2.standing = true;
    }

    endTurn(gameState);
}

async function endRound(gameState) {

    let winner = 0;
    if (gameState.player1.lost == true) {
        winner = 2;
        gameState.player2.roundsWon = 2;
    }
    else if (gameState.player2.lost == true) {
        winner = 1;
        gameState.player1.roundsWon = 2;
    }
    else if (gameState.player1.score > 20) winner = 2;
    else if (gameState.player2.score > 20) winner = 1;
    else if (gameState.player1.filledSpaces == 9) winner = 1;
    else if (gameState.player2.filledSpaces == 9) winner = 2;
    else if (gameState.player1.score > gameState.player2.score) winner = 1;
    else if (gameState.player2.score > gameState.player1.score) winner = 2;
    
    if (((winner == 1 || winner == 0) && gameState.player1.score == 20) || (winner == 2 && gameState.player2.score == 20)) {
        (await client.channels.fetch(gameState.messageChannelId)).messages.fetch(gameState.messageId)
            .then(msg => msg.edit(renderBoard(gameState)));
        await new Promise(r => setTimeout(r, 2500));
    }

    if (winner == 1) {
        gameState.player1.roundsWon++;

        if (gameState.player1.id === client.user.id) {
            respondToSituation(`You are playing the card game Pazaak with a user called ${gameState.player2.name}. You have just won a round.` +
                `You have now won ${gameState.player1.roundsWon} rounds out of 3 needed to win, and your opponent has won ${gameState.player2.roundsWon} rounds.` +
                `Come up with some trash talk or taunt for this situation. Your response should only be a sentence or two.`, await client.channels.fetch(gameState.messageChannelId));
        }
        else if (gameState.player2.id === client.user.id) {
            respondToSituation(`You are playing the card game Pazaak with a user called ${gameState.player1.name}. You have just lost a round.` +
            `Your opponent has now won ${gameState.player1.roundsWon} rounds out of 3 needed to win, and you have won ${gameState.player2.roundsWon} rounds.` +
            `Come up with either an excuse for why you lost or an insult to say to your opponent (not both). Your response should only be a sentence or two.`, await client.channels.fetch(gameState.messageChannelId));
        }
    }
    else if (winner == 2) {
        gameState.player2.roundsWon++;
        if (gameState.player2.id === client.user.id) {
            respondToSituation(`You are playing the card game Pazaak with a user called ${gameState.player1.name}. You have just won a round.` +
                `You have now won ${gameState.player2.roundsWon} rounds out of 3 needed to win, and your opponent has won ${gameState.player1.roundsWon} rounds.` +
                `Come up with some trash talk or taunt for this situation. Your response should only be a sentence or two.`, await client.channels.fetch(gameState.messageChannelId));
        }
        else if (gameState.player1.id === client.user.id) {
            respondToSituation(`You are playing the card game Pazaak with a user called ${gameState.player2.name}. You have just lost a round.` +
            `Your opponent has now won ${gameState.player2.roundsWon} rounds out of 3 needed to win, and you have won ${gameState.player1.roundsWon} rounds.` +
            `Come up with either an excuse for why you lost or an insult to say to your opponent (not both). Your response should only be a sentence or two.`, await client.channels.fetch(gameState.messageChannelId));
        }
    }

    if (gameState.player1.roundsWon == 3 || gameState.player2.roundsWon == 3) {
        gameState.gameOver = true;

        let winPlayer = gameState.player1;
        let losePlayer = gameState.player2;
        if (gameState.player2.roundsWon == 3) {
            winPlayer = gameState.player2;
            losePlayer = gameState.player1;
        }

        let loserScoreEmojis = '⚪⚪⚪';
        switch (losePlayer.roundsWon) {
            case 1:
                loserScoreEmojis = '🔴⚪⚪';
                break;
            case 2:
                loserScoreEmojis = '🔴🔴⚪';
            default:
                break;
        }

        let gameOverTitle = 'Game Over';
        let gameOverMessage = `**Winner**\n${winPlayer.name}: 🔴🔴🔴\n**Loser**\n${losePlayer.name}: ${loserScoreEmojis}`;

        if (losePlayer.lost == true) {
            gameOverMessage = `**Winner**\n${winPlayer.name}\n**Loser**\n${losePlayer.name}`;
            gameOverTitle = 'Game Over by Forfeit';
        }

        let gameOverEmbed = new EmbedBuilder()
            .setColor(0xb078ff)
            .setTitle('Pazaak Beta')
            .addFields(
                {name: gameOverTitle ,value: gameOverMessage}
            )
            .setTimestamp();

        (await client.channels.fetch(gameState.messageChannelId)).messages.fetch(gameState.messageId)
            .then(msg => {
                msg.channel.send({embeds: [gameOverEmbed], components: []})
                msg.delete()
            });

        return;
    }

    resetBoards(gameState);
    drawCard(gameState);
    const startingPlayer = gameState.turn === 1 ? gameState.player1 : gameState.player2;
    if (startingPlayer.id === client.user.id) {
        setTimeout(function() {takeAITurn(gameState)}, 1500);
    }
}

async function resetBoards(gameState) {
    gameState.player1.boardState = ["E", "E", "E", "E", "E", "E", "E", "E", "E"];
    gameState.player2.boardState = ["E", "E", "E", "E", "E", "E", "E", "E", "E"];

    gameState.player1.score = 0;
    gameState.player2.score = 0;

    gameState.player1.standing = false;
    gameState.player2.standing = false;

    gameState.player1.filledSpaces = 0;
    gameState.player2.filledSpaces = 0;

    gameState.roundNumber++;
    gameState.turn = gameState.roundNumber % 2 + 1;

    (await client.channels.fetch(gameState.messageChannelId)).messages.fetch(gameState.messageId)
        .then(msg => msg.edit(renderBoard(gameState)));
}

function renderHand(gameState, interaction) {

    let hand = [];
    let purpleState = "positive";
    let player = null;

    if (interaction.user.id == gameState.player1.id) {
        hand = gameState.player1.hand;
        purpleState = gameState.player1.purpleState;
        player = gameState.player1;
    }
    else if (interaction.user.id == gameState.player2.id) {
        hand = gameState.player2.hand;
        purpleState = gameState.player2.purpleState;
        player = gameState.player2;
    }
    else {
        return {content: "You are not playing in this game.", ephemeral: true};
    }

    let handContent = ``;

    for (card of hand) {
        handContent += symbols.get(card);
    }

    let handEmbed = new EmbedBuilder()
    .setColor(0xb078ff)
    .setTitle(handContent)
    .addFields(
        {name: `Your +/- cards are currently ${purpleState}`, value: "​"}
    )
    .setTimestamp();

    let playerHand = [];
    for (card of player.hand) {
        let cardToRender = card;
        if (card.startsWith('P')) {
            if (player.purpleState == "positive") {
                cardToRender = "B" + card.substring(1);
            }
            else {
                cardToRender = "R" + card.substring(1);
            }
        }
        playerHand.push(symbols.get(cardToRender).split(":")[2]);
    }
    for (let i = 0; i < playerHand.length; i++) {
        playerHand[i] = playerHand[i].slice(0, playerHand[i].length - 1);
    }

    const cardButtons = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('play_1')
					.setLabel('Play')
					.setStyle(ButtonStyle.Primary)
                    .setEmoji(playerHand[0])
                    .setDisabled((player.hand[0] == 'E')),
                new ButtonBuilder()
					.setCustomId('play_2')
					.setLabel('Play')
					.setStyle(ButtonStyle.Primary)
                    .setEmoji(playerHand[1])
                    .setDisabled((player.hand[1] == 'E')),
                new ButtonBuilder()
					.setCustomId('play_3')
					.setLabel('Play')
					.setStyle(ButtonStyle.Primary)
                    .setEmoji(playerHand[2])
                    .setDisabled((player.hand[2] == 'E')),
                new ButtonBuilder()
					.setCustomId('play_4')
					.setLabel('Play')
					.setStyle(ButtonStyle.Primary)
                    .setEmoji(playerHand[3])
                    .setDisabled((player.hand[3] == 'E')),
                new ButtonBuilder()
					.setCustomId('switch_purple')
					.setLabel('Flip +/-')
					.setStyle(ButtonStyle.Primary),
			);

    return {
        embeds: [handEmbed],
        components: [cardButtons],
        ephemeral: true
    };
}

function getCardValue(player, cardNum) {
    const card = player.hand[cardNum - 1];

    if (card.startsWith("E")) {
        return 0;
    }

    if (card.startsWith("B") || (card.startsWith("P") && player.purpleState === "positive")) {
        return parseInt(card.substring(1));
    }
    return -1 * parseInt(card.substring(1));
}

async function playCard(cardNum, gameState, interaction) {
   
    if (cardNum === null) {
        return;
    }

    let currPlayer = (gameState.turn == 1) ? gameState.player1 : gameState.player2;

    if (interaction) {
        if (gameState.cardPlayed == true) {
            interaction.reply({content: "You have already played a card on this turn.", ephemeral: true});
            return;
        }

        if (currPlayer.hand[cardNum - 1] == "E") {
            interaction.reply({content: `Card ${cardNum} has already been played.`, ephemeral: true});
            return;
        }
    }
    

    let newCard = currPlayer.hand[cardNum - 1];
    if (newCard.startsWith("P")) {
        if (currPlayer.purpleState === "positive") {
            newCard = "B" + newCard.substring(1);
        }
        else {
            newCard = "R" + newCard.substring(1);
        }
    }

    
    currPlayer.score += getCardValue(currPlayer, cardNum);
    placeCard(gameState, newCard);

    currPlayer.hand[cardNum - 1] = "E";
    currPlayer.cardsLeft--;

    gameState.cardPlayed = true;

    if (interaction) {
        interaction.update(renderHand(gameState, interaction));
    }
    
}

async function placeCard(gameState, newCard) {

    if (gameState.turn == 1) {
        gameState.player1.boardState[gameState.player1.filledSpaces] = newCard;
        gameState.player1.filledSpaces++;
        if (gameState.player1.filledSpaces == 9) {
            endRound(gameState);
            return;
        }
        if (gameState.player1.score == 20) {
            stand(gameState);
            return;
        }
    }
    else {
        gameState.player2.boardState[gameState.player2.filledSpaces] = newCard;
        gameState.player2.filledSpaces++;

        if (gameState.player2.filledSpaces == 9) {
            endRound(gameState);
            return;
        }
        if (gameState.player2.score == 20) {
            stand(gameState);
            return;
        }
    }


    (await client.channels.fetch(gameState.messageChannelId)).messages.fetch(gameState.messageId)
        .then(msg => msg.edit(renderBoard(gameState)));
}

function flipPurple(gameState, interaction) {
    let currPlayer = null;
    if (gameState.player1.id == interaction.user.id) currPlayer = gameState.player1;
    else if (gameState.player2.id == interaction.user.id) currPlayer = gameState.player2;
    else {
        interaction.reply({content: "Something Went Wrong", ephemeral: true});
        return;
    }

    if (currPlayer.purpleState == "positive") currPlayer.purpleState = "negative";
    else currPlayer.purpleState = "positive";

    interaction.update(renderHand(gameState, interaction));
}

function isActivePlayer(gameState, user) {
    if (gameState.turn == 1 && user.id != gameState.player1.id) {
        return false;
    }
    else if (gameState.turn == 2 && user.id != gameState.player2.id) {
        return false;
    }
    return true;
}

async function findGame(interaction) {
    let foundGame = null;
    for (game of pazaakGames) {
        if (!game.gameOver) {
            if (game.messageId == interaction.message.id) {
                foundGame = game;
                break;
            }
            else if (interaction.message.reference != null && game.messageId == interaction.message.reference.messageId) {
                foundGame = game;
                break;
            }
        }
    }
    if (foundGame == null) {
        await interaction.reply({content: "This game is not active.", ephemeral: true});
    }

    return foundGame;
}

function takeAITurn(gameState) {

    const activePlayer = gameState.turn === 1 ? gameState.player1 : gameState.player2;
    const humanPlayer = gameState.turn === 1 ? gameState.player2 : gameState.player1;
    const botPlayerNum = gameState.turn;
    const roundNum = gameState.roundNumber;

    activePlayer.purpleState = "negative";

    const lowestPossibleTotal = activePlayer.score + Math.min(0, getCardValue(activePlayer, 1), getCardValue(activePlayer, 2), getCardValue(activePlayer, 3), getCardValue(activePlayer, 4));
    
    let currentPossibleTotal = activePlayer.score;
    let bestCardNum = null;

    activePlayer.purpleState = activePlayer.score < 20 ? "positive" : "negative";
    for (let i = 1; i <=4; i++) {
        const newScore = activePlayer.score + getCardValue(activePlayer, i);
        if (newScore <= 20 && 20 - newScore < 20 - currentPossibleTotal) {
            currentPossibleTotal = newScore;
            bestCardNum = i;
        }
    }

    if (currentPossibleTotal === 20) {
        playCard(bestCardNum, gameState);
    }
    else if (currentPossibleTotal === 19) {
        if (lowestPossibleTotal <= 11 && humanPlayer.score !== 20) {
            playCard(bestCardNum, gameState);
        }
    }
    else if (currentPossibleTotal === 18) {
        if (lowestPossibleTotal <= 13 && humanPlayer.score !== 19) {
            playCard(bestCardNum, gameState);
        }
    }

    //make sure it's still the bots turn
    if (gameState.turn !== botPlayerNum || gameState.roundNumber !== roundNum) {
        return;
    }
    
    if (activePlayer.score > 20) {
        if (humanPlayer.score >= 18 && humanPlayer.roundsWon !== 2) {
            stand(gameState);
        }
        else {
            playCard(bestCardNum, gameState);
        }
    }

    //make sure it's still the bots turn
    if (gameState.turn !== botPlayerNum || gameState.roundNumber !== roundNum) {
        return;
    }

    if (activePlayer.score >= humanPlayer.score && activePlayer.score >= 18) {
        stand(gameState);
    }
    else {
        endTurn(gameState);
    }
}