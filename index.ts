/**
 * x-potato is a discord bot offering general utilities and server moderation tools
 * Copyright (C) 2020 Yi Fan Song <yfsong00@gmail.com>, Zikai Qin<zikaiqin99@gmail.com>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 **/

import * as discord from 'discord.js';

import { config } from 'dotenv';

var result = config();
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

	if (!message.member.permissions.has(discord.Permissions.FLAGS.ADMINISTRATOR)) return;
	
	if (message.content.startsWith(';move')) {

		if (!message.mentions.members || message.mentions.members.size === 0) {
			var fromStart = message.content.indexOf('"');
			var fromEnd = message.content.indexOf('"', fromStart + 1);

			var toStart = message.content.indexOf('"', fromEnd + 1);
			var toEnd = message.content.indexOf('"', toStart + 1);

			if (fromStart < 0 || fromEnd < 0 || toStart < 0 || toEnd < 0) {
				// TODO: make custom error handling functions
				message.reply('Failed to move users: missing origin channel or destination channel.');
				return;
			}
			var from = message.content.substring(fromStart + 1, fromEnd);
			var to = message.content.substring(toStart + 1, toEnd);

			var fromChannel = message.guild.channels.cache.find((channel) => {
				return channel.name === from;
			});
			if (!fromChannel) {
				message.reply('Failed to move users: could not resolve origin channel.');
				return;
			}
			var toChannel = message.guild.channels.cache.find((channel) => {
				return channel.name === to;
			});
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
			var to = message.content.substring(toStart + 1, toEnd);

			var toChannel = message.guild.channels.cache.find((channel) => {
				return channel.name === to;
			});
			if (!toChannel) {
				message.reply('Failed to move users: could not resolve destination channel.');
				return;
			}

			var members = message.mentions.members;
			members.each((member) => {
				if (member.voice) {
					member.voice.setChannel(toChannel);
				} else {
					message.reply('oops, something failed');
					return;
				}
			});
		}

		message.reply('Users moved successfully!')
	}
});

client.login(process.env.TOKEN);
