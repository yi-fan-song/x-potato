import discord from 'discord.js';

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

		if (!message.mentions.members) {
			var fromStart = message.content.indexOf('"');
			var fromEnd = message.content.indexOf('"', fromStart + 1);

			var toStart = message.content.indexOf('"', fromEnd + 1);
			var toEnd = message.content.indexOf('"', toStart + 1);

			if (fromStart < 0 || fromEnd < 0 || toStart < 0 || toEnd < 0) {
				// TODO: make custom error handling functions
				message.reply('Failed to move users: missing origin channel or destination channel.');
				return;
			}
			var from = message.content.substring(fromStart, fromEnd);
			var to = message.content.substring(toStart, toEnd);

			var fromChannel = message.guild.channels.resolve(new discord.GuildChannel(message.guild, {name: from}));
			if (!fromChannel) {
				message.reply('Failed to move users: could not resolve origin channel.');
				return;
			}
			var toChannel = message.guild.channels.resolve(new discord.GuildChannel(message.guild, {name: to}));
			if (!toChannel) {
				message.reply('Failed to move users: could not resolve destination channel.');
				return;
			}
			
			var members = fromChannel.members;
			if (!members) {
				message.reply('Failed to move users: there are no users to move.');
				return;
			}
			members.each(member => {
				member.voice.setChannel(toChannel);
			});
		} else {
			var toStart = message.content.indexOf('"');
			var toEnd = message.content.indexOf('"', toStart + 1);

			if (toStart < 0 || toEnd < 0) {
				// TODO: make custom error handling functions (?)
				message.reply('Failed to move users: missing destination channel.');
				return;
			}
			var to = message.content.substring(toStart, toEnd);

			var toChannel = message.guild.channels.resolve(new discord.GuildChannel(message.guild, {name: to}));
			if (!toChannel) {
				message.reply('Failed to move users: could not resolve destination channel.');
				return;
			}

			var members = message.mentions.members;
			members.each((member) => {
				if (member.voice.connection.status = 0) {
					member.voice.setChannel(toChannel);
				}
			});
		}

		message.reply('Users moved successfully!')
	}
});

client.login(process.env.TOKEN);
