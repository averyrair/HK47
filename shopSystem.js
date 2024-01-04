const {
    EmbedBuilder, 
    ButtonBuilder, 
    ActionRowBuilder, 
    ButtonStyle,
    StringSelectMenuBuilder, 
    StringSelectMenuOptionBuilder,
} = require('discord.js');
const sqlActions = require('./sqlActions');
const { client } = require('./bot');
const { respondToSituation } = require('./gptRespond')

let shopInstances = [];

let defaultShopItems = [
    {name: '+1 Card', emoji: '894706597782257705', price: 500, limit: 4},
    {name: '+2 Card', emoji: '894706597845151864', price: 700, limit: 4},
    {name: '+3 Card', emoji: '894706597899698277', price: 900, limit: 4},
    {name: '+4 Card', emoji: '894706597887090830', price: 1200, limit: 4},
    {name: '+5 Card', emoji: '894706598071631883', price: 1500, limit: 4},
    {name: '+6 Card', emoji: '894706597572513823', price: 2000, limit: 4},
    {name: '-1 Card', emoji: '894706597991948339', price: 800, limit: 4},
    {name: '-2 Card', emoji: '894706597761273898', price: 1200, limit: 4},
    {name: '-3 Card', emoji: '894706598017122424', price: 1600, limit: 4},
    {name: '-4 Card', emoji: '894706597606076437', price: 2000, limit: 4},
    {name: '-5 Card', emoji: '894706597731909725', price: 2500, limit: 4},
    {name: '-6 Card', emoji: '894706598113607740', price: 3000, limit: 4},
    {name: '±1 Card', emoji: '894706597765480490', price: 1000, limit: 4},
    {name: '±2 Card', emoji: '894706598046470194', price: 1500, limit: 4},
    {name: '±3 Card', emoji: '894706598021328927', price: 2000, limit: 4},
    {name: '±4 Card', emoji: '894706597673205831', price: 2500, limit: 4},
    {name: '±5 Card', emoji: '894706598038097990', price: 3000, limit: 4},
    {name: '±6 Card', emoji: '894706597970984991', price: 4000, limit: 4}
];

module.exports = {
    initShop,
    nextPage,
    prevPage,
    selectItem,
    buyItem
}

async function findShop(interaction) {
    let foundShop = null;
    for (instance of shopInstances) {
        if (instance.messageId == interaction.message.id) {
            foundShop = instance;
            break;
        }
    }
    if (foundShop == null) {
        await interaction.reply({content: "This shop is not active.", ephemeral: true});
    }

    return foundShop;
}

async function initShop(interaction) {

    let instance = {
        userId: interaction.user.id,
        guildId: interaction.guildId,
        currPage: 1,
        itemSelected: null,
        messageId: null
    };

    shopMessage = await renderShopPage(instance);
    shopMessage.fetchReply = true;

    let instanceMessage = await interaction.reply(shopMessage);
    instance.messageId = instanceMessage.id;

    shopInstances.push(instance);
}

async function renderShopPage(shopInstance) {

    let member = await (await client.guilds.fetch(shopInstance.guildId)).members.fetch(shopInstance.userId);

    let userBalance = (await sqlActions.getMember(member)).credits
    let shopItems = defaultShopItems //+ guild specific items
    let numShopItems = shopItems.length
    let numShopPages = numShopItems / 6 + ((numShopItems % 6 == 0) ? 0 : 1);

    let itemsOnPage = []
    let startIndex = ((shopInstance.currPage - 1) * 6)
    for (let i = 0; i < 6; i++) {
        itemsOnPage[i] = shopItems[i + startIndex];
    }

    let body = ``
    for (item of itemsOnPage) {
        body += `${client.emojis.cache.get(item.emoji)} ${item.name} : ${item.price} <:credits:1186794130098114600>\n`
    }

    let embed = new EmbedBuilder()
    .setColor(0x533c61)
    .setTitle(`Shop (page ${shopInstance.currPage})\n${member.displayName} : ${userBalance} <:credits:1186794130098114600>`)
    .addFields(
        {name: '⠀' ,value: body},
    )
    .setTimestamp();


    let selectMenuBuilder = new StringSelectMenuBuilder()
        .setCustomId('shop_dropdown')
        .setPlaceholder('Select item to purchase');

    for (let i = 0; i < itemsOnPage.length; i++) {
        selectMenuBuilder.addOptions(
            new StringSelectMenuOptionBuilder()
                .setLabel(itemsOnPage[i].name)
                .setValue(`${i}`)
                .setEmoji(itemsOnPage[i].emoji)
        );
    }

    const dropDown = new ActionRowBuilder()
        .addComponents(
            selectMenuBuilder,
        )

    const buttonRow = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('prev_page')
                .setLabel('◀️')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(shopInstance.currPage == 1),
            new ButtonBuilder()
                .setCustomId('next_page')
                .setLabel('▶️')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(shopInstance.currPage == numShopPages),
            new ButtonBuilder()
                .setCustomId('buy_item')
                .setLabel('Purchase')
                .setStyle(ButtonStyle.Success)
                .setDisabled(false)
        );

    return {embeds: [embed], components: [dropDown, buttonRow]};
}

async function nextPage(interaction) {
    let shopInstance = await findShop(interaction);
    if (!shopInstance) {
        return;
    }

    if (interaction.user.id !== shopInstance.userId) {
        interaction.reply({content: "You are not the active shopper.", ephemeral: true});
        return;
    }

    shopInstance.currPage++;
    shopInstance.itemSelected = null;
    interaction.update(await renderShopPage(shopInstance));
}

async function prevPage(interaction) {
    let shopInstance = await findShop(interaction);
    if (!shopInstance) {
        return;
    }

    if (interaction.user.id !== shopInstance.userId) {
        interaction.reply({content: "You are not the active shopper.", ephemeral: true});
        return;
    }

    shopInstance.currPage--;
    shopInstance.itemSelected = null;
    interaction.update(await renderShopPage(shopInstance));
}

async function selectItem(interaction, itemNum) {
    let shopInstance = await findShop(interaction);
    if (!shopInstance) {
        return;
    }

    if (interaction.user.id !== shopInstance.userId) {
        interaction.reply({content: "You are not the active shopper.", ephemeral: true});
        return;
    }
    else {
        interaction.deferUpdate();
    }

    shopInstance.itemSelected = itemNum;
}

async function buyItem(interaction) {
    let shopInstance = await findShop(interaction);
    if (!shopInstance) {
        return;
    }

    if (interaction.user.id !== shopInstance.userId) {
        interaction.reply({content: "You are not the active shopper.", ephemeral: true});
        return;
    }

    let member = await (await client.guilds.fetch(shopInstance.guildId)).members.fetch(shopInstance.userId);

    let userBalance = (await sqlActions.getMember(member)).credits;

    let item = getShopItem(shopInstance.itemSelected + 6 * (shopInstance.currPage - 1));
    let itemPrice = item.price;

    if (userBalance < itemPrice) {
        let messageText = await respondToSituation(
            `${interaction.member.displayName} is trying to buy ` + 
            `an item from the shop buy they do not have enough credits. ` +
            `Make fun of them for it.`);
        interaction.reply({content: messageText, ephemeral: true});
        return;
    }

    //if the item is a pazaak card
    let itemIndex = defaultShopItems.indexOf(item)
    if (itemIndex !== -1) {
        let currCollection = (await sqlActions.getMember(interaction.member)).pazaak_collection;

        let newNum = parseInt(currCollection.charAt(itemIndex)) + 1;

        if (newNum >= 5) {
            interaction.reply({content: 'You already have the maximum allowed copies of this card', ephemeral: true});
            return;
        }

        let newCollection = currCollection.substring(0, itemIndex) + newNum + currCollection.substring(itemIndex + 1);

        sqlActions.setPazaakCollection(interaction.member, newCollection);
    }

    sqlActions.addCredits(interaction.member, itemPrice * -1);
    await interaction.update(await renderShopPage(shopInstance));
    interaction.followUp(`${client.emojis.cache.get(item.emoji)}\n` +
        `${interaction.member.displayName} has purchased ${item.name} ` +
        `for ${item.price} <:credits:1186794130098114600>`
    );

}

function getShopItem(itemNum) {
    //TODO
    //eventually needs to handle guild specific items, but default for now
    return defaultShopItems[itemNum]
}