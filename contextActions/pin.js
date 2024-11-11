const { ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');
const sqlActions = require('../sqlActions');

module.exports = {
	interactionID: 'Pin',
	data: new ContextMenuCommandBuilder()
        .setName('Pin')
        .setType(ApplicationCommandType.Message),
	async execute(interaction) {

        let hasPermission = false;
        let pinRoles = await sqlActions.getPermRole(interaction.guildId, 'pin');
        for (pinRole of pinRoles) {
            if (interaction.member.roles.cache.some(role => role.id === pinRole.role_id)) {
                hasPermission = true;
                break;
            }
        }
        if (!hasPermission) {
            interaction.reply({content:"You don't have permission to pin messages", ephemeral: true});
            return;
        }

		interaction.deferReply();
        interaction.deleteReply();
		const message = await interaction.channel.messages.fetch(interaction.targetId);
        message.pin()
	},
};