import discord, { DiscordAPIError } from 'discord.js';

import dotenv from 'dotenv';

var result = dotenv.config();
if (result.error) {
	throw result.error;
}

var client = new discord.Client();

client.on('ready', () => {
	console.log('Bot ready!');
});


// TODO: per server config
client.on('message', message => {
  // Ignore messages that aren't from a guild
	if (!message.guild) return;
	
	if (message.content.startsWith(';move')) {
		var fromStart = message.content.indexOf('"');
		var fromEnd = message.content.indexOf('"', fromStart + 1);

		var toStart = message.content.indexOf('"', fromEnd + 1);
		var toEnd = message.content.indexOf('"', toStart + 1);

		if (fromStart < 0 || fromEnd < 0 || toStart < 0 || toEnd < 0) {
			// TODO: make custom error handling functions
			message.reply('Failed to move users: missing origin channel or destination channel.');
		}
		var from = message.content.substring(fromStart, fromEnd);
		var to = message.content.substring(toStart, toEnd);

		var fromChannel = message.guild.channels.resolve(new discord.GuildChannel(message.guild, {name: from}));
		if (!fromChannel) {
			message.reply('Failed to move users: could not resolve origin channel.');
		}
		var toChannel = message.guild.channels.resolve(new discord.GuildChannel(message.guild, {name: to}));
		if (!toChannel) {
			message.reply('Failed to move users: could not resolve destination channel.');
		}
        
		const user = message.mentions.users.first();

		if (user) {
			const member = message.guild.member(user);
			if (member) {
					member.voice.setChannel();
			}
		}
	}
});

client.login(process.env.TOKEN);
