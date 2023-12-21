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
    {name: '-3 Card', emoji: '', price: 1600, limit: 4},
    {name: '-4 Card', emoji: '', price: 2000, limit: 4},
    {name: '-5 Card', emoji: '', price: 2500, limit: 4},
    {name: '-6 Card', emoji: '', price: 3000, limit: 4},
    {name: '±1 Card', emoji: '', price: 1000, limit: 4},
    {name: '±2 Card', emoji: '', price: 1500, limit: 4},
    {name: '±3 Card', emoji: '', price: 2000, limit: 4},
    {name: '±4 Card', emoji: '', price: 2500, limit: 4},
    {name: '±5 Card', emoji: '', price: 3000, limit: 4},
    {name: '±6 Card', emoji: '', price: 4000, limit: 4}
];

module.exports = {
    initShop
}

async function initShop(interaction) {

    let userBalance = (await sqlActions.getMember(interaction.member)).credits
    let shopItems = defaultShopItems //+ guild specific items
    let numShopItems = shopItems.length

    let itemsOnPage = []
    for (let i = 0; i < 6; i++) {
        itemsOnPage[i] = shopItems[i];
    }

    let body = ``
    for (item of itemsOnPage) {
        body += `${client.emojis.cache.get(item.emoji)} ${item.name} : ${item.price} <:credits:1186794130098114600>\n`
    }

    let embed = new EmbedBuilder()
    .setColor(0x533c61)
    .setTitle(`Shop (page 1)\n${userBalance} <:credits:1186794130098114600>`)
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
                .setLabel(shopItems[i].name)
                .setValue(`shop_item_select_${i}`)
                .setEmoji(shopItems[i].emoji)
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
                .setDisabled(true),
            new ButtonBuilder()
                .setCustomId('next_page')
                .setLabel('▶️')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(false),
            new ButtonBuilder()
                .setCustomId('buy_item')
                .setLabel('Purchase')
                .setStyle(ButtonStyle.Success)
                .setDisabled(false)
        );

    interaction.reply({embeds: [embed], components: [dropDown, buttonRow]});
}