const fs = require('node:fs');
const path = require('node:path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
require('dotenv').config();

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

const contextActions = [];
const contextActionPath = path.join(__dirname, 'contextActions');
const contextActionFiles = fs.readdirSync(contextActionPath).filter(file => file.endsWith('.js'));


for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
    console.log(command);
	commands.push(command.data.toJSON());
}

for (const file of contextActionFiles) {
	const filePath = path.join(contextActionPath, file);
	const contextAction = require(filePath);
	console.log(contextAction);
	contextActions.push(contextAction.data.toJSON());
}

// Place your client and guild ids here
const clientId = process.env.DISCORD_BOT_CLIENT_ID;
const guildId = process.env.GUILD_ID;

const rest = new REST({ version: '10' }).setToken(process.env.REST_TOKEN);

(async () => {

	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put( //adding commands
			//Routes.applicationGuildCommands(clientId, guildId), //for guild only commands
			Routes.applicationCommands(clientId), //for global commands
			{ body: commands.concat(contextActions) },
		);

		// //deleting commands
		// await rest.put(Routes.applicationCommands(clientId), { body: [] })
		// 	.then(() => console.log('Successfully deleted all guild commands.'))
		// 	.catch(console.error);

		console.log('Successfully reloaded application (/) commands.');

	} catch (error) {
		console.error(error);
	}
})();