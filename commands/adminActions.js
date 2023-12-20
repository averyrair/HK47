const { PermissionFlagsBits, SlashCommandBuilder, EmbedBuilder, Embed } = require('discord.js');
const sqlActions = require('../sqlActions');

module.exports = {
	data: new SlashCommandBuilder()
        .setName('admin-actions')
        .setDescription('Shows menu for Admin Actions')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subCommand => subCommand
            .setName('create-event')
            .setDescription('Creates a new event.')
            .addStringOption(option => option
                .setName('name')
                .setDescription('The name of the event.')
                .setRequired(true))
            .addStringOption(option => option
                .setName('date')
                .setDescription('The date for the event, formatted in (yyyy-mm-dd).')
                .setRequired(true))
            .addStringOption(option => option
                .setName('time')
                .setDescription('The time of the event in 24hr time (1:00pm = 13:00).')
                .setRequired(true))
            .addChannelOption(option => option
                .setName('channel')
                .setDescription('The channel where the event should be announced')
                .setRequired(true))
            .addIntegerOption(option => option
                .setName('interval')
                .setDescription('Number of days between events (leave blank for single events)')
                .setRequired(false))
            .addRoleOption(option => option
                .setName('role')
                .setDescription('Role that should be pinged for the event, if any.')
                .setRequired(false))    
        )
        .addSubcommand(subCommand => subCommand
            .setName('delete-event')
            .setDescription('Deletes an existing event.')
            .addStringOption(option => option
                .setName('name')
                .setDescription('The name of the event to be deleted.')
                .setRequired(true))
        )
        .addSubcommand(subCommand => subCommand
            .setName('create-team')
            .setDescription('Creates a new team for the competition.')
            .addRoleOption(option => option
                .setName('role')
                .setDescription('Select the role associated with the team.')
                .setRequired(true))
        )
        .addSubcommand(subCommand => subCommand
            .setName('delete-team')
            .setDescription('Deletes an existing team.')
            .addRoleOption(option => option
                .setName('role')
                .setDescription('Select the role associated with the team.')
                .setRequired(true))
	    
        )
        .addSubcommand(subCommand => subCommand
            .setName('create-scoreboard')
            .setDescription('Designates a voice channel as a scoreboard display.')
            .addChannelOption(option => option
                .setName('channel')
                .setDescription('Enter a locked voice channel for team scores to be displayed in.')
                .setRequired(true)),
            
        )
        .addSubcommand(subCommand => subCommand
            .setName('delete-scoreboard')
            .setDescription('Removes the bottom scoreboard display channel from active use.')
        )
        .addSubcommand(subCommand => subCommand
            .setName('start-competition')
            .setDescription('Begins a team competition!')
            .addStringOption(option => option
                .setName('date')
                .setDescription('The initial date when the competition should end, formatted in (yyyy-mm-dd).')
                .setRequired(true))
            .addStringOption(option => option
                .setName('time')
                .setDescription('The time of the event in 24hr time (1:00pm = 13:00).')
                .setRequired(true))
            .addIntegerOption(option => option
                .setName('interval')
                .setDescription('Number of days the competition will normally last')
                .setRequired(true))
            .addChannelOption(option => option
                .setName('channel')
                .setDescription('The channel where the competition results should be announced.')
                .setRequired(true)),
        )
        .addSubcommand(subCommand => subCommand
            .setName('end-competition')
            .setDescription('Immediately stops the competition without posting scores.')
        )
        .addSubcommand(subCommand => subCommand
            .setName('reset-scores')
            .setDescription('Resets competition xp scores for the entire server. This does not affect lifetime xp.')
        )
        .addSubcommand(subCommand => subCommand
            .setName('set-xp')
            .setDescription('Set\'s a user\'s competition xp to a given value')
            .addUserOption(option =>
                option.setName('user')
                    .setDescription('The person who\'s xp should be updated')
                    .setRequired(true))
            .addIntegerOption(option => 
                option.setName('value')
                    .setDescription('The new xp value')
                    .setRequired(true))
        ),
	async execute(interaction) {
		switch (interaction.options.getSubcommand()) {
            case 'create-event':
                createEvent(interaction);
                break;
            case 'delete-event':
                deleteEvent(interaction);
                break;
            case 'create-team':
                createTeam(interaction);
                break;
            case 'delete-team':
                deleteTeam(interaction);
                break;
            case 'create-scoreboard':
                createScoreboard(interaction);
                break;
            case 'delete-scoreboard':
                deleteScoreboard(interaction);
                break;
            case 'start-competition':
                startCompetition(interaction);
                break;
            case 'end-competition':
                endCompetition(interaction);
                break;
            case 'reset-scores':
                resetScores(interaction);
                break;
            case 'set-xp':
                setXP(interaction);
                break;
            default:
                break;
        }
	},
};

async function createEvent(interaction) {
    const name = interaction.options.getString('name');
    const channel = interaction.options.getChannel('channel');
    const date = interaction.options.getString('date');
    const time = interaction.options.getString('time');
    const interval = interaction.options.getInteger('interval');
    const role = interaction.options.getRole('role');


    sqlActions.deleteEvent(interaction.guild, name);
    sqlActions.addEvent(name, channel, `${date} ${time}`, interval, role);


    //fetch event again to confirm it was entered into the database properly
    const newEvent = (await sqlActions.getEvent(interaction.guild, name))[0];
    const embed = new EmbedBuilder()
    .setColor(0x533c61)
    .setTitle(`Event Scheduled`)
    .addFields(
        {
            name: newEvent.event_name, 
            value: `${newEvent.time}\nin <#${newEvent.channel_id}>\n `
            + `${(newEvent.event_interval) ? `every ${newEvent.event_interval} days\n` : ''} ${(newEvent.event_role_id) ? `for <@&${newEvent.event_role_id}>` : ''}`
        },
    )
    .setTimestamp();

    interaction.reply({ content: '', embeds: [embed] });
}

async function deleteEvent(interaction) {

    const name = interaction.options.getString('name');

    sqlActions.deleteEvent(interaction.guild, interaction.options.getString('name'));
    
    const embed = new EmbedBuilder()
    .setColor(0x533c61)
    .setTitle(`Event Deleted`)
    .addFields(
        {
            name: name, 
            value: ' '
        },
    )
    .setTimestamp();

    interaction.reply({ content: '', embeds: [embed] });
}

async function createTeam(interaction) {
    sqlActions.addTeam(interaction.guild, interaction.options.getRole('role'));
    const embed = new EmbedBuilder()
    .setColor(0x533c61)
    .setTitle(`Team Created`)
    .addFields(
        {
            name: `⠀`, 
            value: `New team <@&${interaction.options.getRole('role').id}> created`
        },
    )
    .setTimestamp();

    interaction.reply({ content: '', embeds: [embed] });
}


async function deleteTeam(interaction) {

    let notice = ''
    sqlActions.deleteTeam(interaction.guild, interaction.options.getRole('role'))

    if ((await sqlActions.getScoreChannels(interaction.guild)).length > (await sqlActions.getTeams(interaction.guild)).length) {
            sqlActions.deleteScoreChannel(interaction.guild);
            notice = 'Note: bottom scoreboard channel has been removed from use to match total number of teams.';
    }

    const embed = new EmbedBuilder()
    .setColor(0x533c61)
    .setTitle(`Team Deleted`)
    .addFields(
        {
            name: `⠀`, 
            value: `Team <@&${interaction.options.getRole('role').id}> deleted\n\n${notice}`
        },
    )
    .setTimestamp();

    interaction.reply({ content: '', embeds: [embed] });
}

async function createScoreboard(interaction) {
    if ((await sqlActions.getTeams(interaction.guild)).length <= (await sqlActions.getScoreChannels(interaction.guild)).length) {
        await interaction.reply({ content: 'ERROR: number of channels exceeds number of teams', ephemeral: true });
    }
    else {
        sqlActions.addScoreChannel(interaction.options.getChannel('channel'))
        
        const embed = new EmbedBuilder()
            .setColor(0x533c61)
            .setTitle(`Scoreboard Channel Added`)
            .addFields(
                {
                    name: `⠀`, 
                    value: `Competition team scores will now be displayed in ${interaction.options.getChannel('channel')}`
                },
            )
            .setTimestamp();

        await interaction.reply({ content: '', embeds: [embed] });
    }
}

async function deleteScoreboard(interaction) {
    await sqlActions.deleteScoreChannel(interaction.guild);
    
    const embed = new EmbedBuilder()
            .setColor(0x533c61)
            .setTitle(`Scoreboard Channel Removed`)
            .addFields(
                {
                    name: `⠀`, 
                    value: `The bottom competition scoreboard channel will no longer be updated with scores`
                },
            )
            .setTimestamp();

    await interaction.reply({ content: '', embeds: [embed] });
}

async function startCompetition(interaction) {

    sqlActions.deleteEvent(interaction.guild, 'scoreboard');
    sqlActions.addEvent(
        'scoreboard', 
        interaction.options.getChannel('channel'), 
        `${interaction.options.getString('date')} ${interaction.options.getString('time')}`, 
        interaction.options.getInteger('interval'), 
        null
    );

    const newEvent = (await sqlActions.getEvent(interaction.guild, 'scoreboard'))[0];
    
    const embed = new EmbedBuilder()
        .setColor(0x533c61)
        .setTitle(`Competition Started!`)
        .addFields(
            {
                name: `⠀`, 
                value: `The competition has now started. It will end on ${newEvent.time} and repeat every ${newEvent.event_interval} days.`
            },
        )
        .setTimestamp();

    await interaction.reply({ content: '', embeds: [embed] });
}

async function endCompetition(interaction) {
    sqlActions.deleteEvent(interaction.guild, 'scoreboard');
    
    const embed = new EmbedBuilder()
        .setColor(0x533c61)
        .setTitle(`Competition Ended`)
        .addFields(
            {
                name: `⠀`, 
                value: `The competition has been cancelled.`
            },
        )
        .setTimestamp();

    await interaction.reply({ content: '', embeds: [embed] });
	
}

async function resetScores(interaction) {
    sqlActions.resetScores(interaction.guild);
    
    const embed = new EmbedBuilder()
        .setColor(0x533c61)
        .setTitle(`Competition Scores Reset`)
        .addFields(
            {
                name: `⠀`, 
                value: `All competition xp scores have been reset to zero. This does not affect lifetime xp`
            },
        )
        .setTimestamp();

    await interaction.reply({ content: '', embeds: [embed] });
}

async function setXP(interaction) {

    const member = interaction.options.getMember('user');

    sqlActions.setXP(await interaction.guild.members.fetch(member.id), interaction.options.getInteger('value'));


    const embed = new EmbedBuilder()
        .setColor(0x533c61)
        .setTitle(`XP Set!`)
        .addFields(
            {
                name: `⠀`, 
                value: `${member.displayName} now has ${(await sqlActions.getXP(member))}xp`
            },
        )
        .setTimestamp();

    await interaction.reply({ content: '', embeds: [embed] });
	
}
