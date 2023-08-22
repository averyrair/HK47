const { Events } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const translateToEnglish = require('../interactions/translateToEnglish');
const translateToSwedish = require('../interactions/translateToSwedish');

module.exports = {
    name: Events.InteractionCreate,
    once: false,
    async execute(interaction) {
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) {
                return;
            }

            try {
                await command.execute(interaction);
            }
            catch (error) {
                console.error(error);
                await interaction.reply({
                    content: '*Irritated Remark:* There was an error executing this command due to the overwhelming stupidity of my master.',
                    ephemeral: true
                });
            }
        }
        else {
            const interactionModule = interaction.client.interactions.get(interaction.customId);

            if (!interactionModule) {
                //context menu command
                try {
                    if (interaction.commandName === 'Translate To English') {
                        await translateToEnglish.execute(interaction);
                    }
                    else if (interaction.commandName === 'Translate To Swedish') {
                        await translateToSwedish.execute(interaction);
                    }
                    else return;
                }
                catch (error) {
                    console.error(error);
                    await interaction.reply({
                        content: '*Irritated Remark:* There was an error executing this command due to the overwhelming stupidity of my master.',
                        ephemeral: true
                    });
                }

                return;
            }

            try {
                await interactionModule.execute(interaction);
            }
            catch (error) {
                console.error(error);
                await interaction.reply({
                    content: '*Irritated Remark:* There was an error executing this command due to the overwhelming stupidity of my master.',
                    ephemeral: true
                });
            }
        }
    }
}