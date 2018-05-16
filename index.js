const winston = require('winston');
const util = require('util');

const endpoint = 'https://discordapp.com/api/v6/webhooks/';
const webhookURLRegex = /(https?):\/\/([(a-z0-9).]+)\/api(?:\/v([0-9]+))*\/webhooks\/([0-9]{1,20})\/([a-z0-9_-]+)/gi;

exports = module.exports = DiscordLogger = function(options) {
	this.name = options.name || 'DiscordLogger';
	this.level = options.level || 'info';

	let webhooks = [];
	if (typeof options.webhooks === 'string' || (typeof options.webhooks === 'object' && !Array.isArray(options.webhooks))) {
		webhooks.push(options.webhooks)
	} else if (Array.isArray(options.webhooks)) {
		webhooks = options.webhooks;
	} else {
		return new Error('Invalid webhooks format');
	}

	webhooks = webhooks.map(webhook => {
		if (typeof webhook === 'string') {
			const match = options.webhooks.match(webhookURLRegex);
			if (match) {
				return { 'id': match[4], 'token': match[5] };
			} else {
				return undefined;
			}
		} else if (typeof webhook === 'object') {
			return { 'id': webhook.id, 'token': webhook.token };
		}

		return undefined;
	});

	console.log(webhooks);

	this.webhooks = webhooks;
	return this.webhooks;
};

util.inherits(DiscordLogger, winston.Transport);

DiscordLogger.prototype.log = function (level, msg, meta, callback) {

};