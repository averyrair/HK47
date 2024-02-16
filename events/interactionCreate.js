const { Events } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

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
        else if (interaction.isContextMenuCommand()) {
            const contextActionModule = interaction.client.interactions.get(interaction.commandName);

            if (!contextActionModule) {
                return;
            }

            try {
                await contextActionModule.execute(interaction);
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