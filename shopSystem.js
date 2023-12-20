const {
    EmbedBuilder, 
    ButtonBuilder, 
    ActionRowBuilder, 
    ButtonStyle,
    StringSelectMenuBuilder, 
    StringSelectMenuOptionBuilder,
} = require('discord.js');
const sqlActions = require('./sqlActions')

let shopInstances = [];

module.exports = {
    initShop
}

async function initShop(interaction) {
    let userBalance = (await sqlActions.getMember(interaction.member)).credits

    let body = `No items have been added to the shop yet.`
    let embed = new EmbedBuilder()
    .setColor(0x533c61)
    .setTitle(`Shop (page 1)\n${userBalance} <:credits:1186794130098114600>`)
    .addFields(
        {name: '⠀' ,value: body},
    )
    .setTimestamp();

    const dropDown = new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
                    .setCustomId('shop_dropdown')
                    .setPlaceholder('Select item to purchase')
                    .addOptions(
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Item 1 : 15 <:credits:1186794130098114600>')
                            .setValue('shop_item_1')
                            .setEmoji('894706597782257705'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Item 2 : 30 <:credits:1186794130098114600>')
                            .setValue('shop_item_2')
                            .setEmoji('894706597606076437')
                    ),
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