const winston = require('winston');
const util = require('util');
const https = require('https');

module.exports = DiscordLogger = winston.transports.DiscordLogger = function(options) {
	this.name = options.name || 'DiscordLogger';
	this.level = options.level || 'info';

	if (!options.webhooks)
		throw new Error('Webhooks have to be set in options');

	let webhooks = [];
	if (typeof options.webhooks === 'string' || (typeof options.webhooks === 'object' && !Array.isArray(options.webhooks))) {
		webhooks.push(options.webhooks)
	} else if (Array.isArray(options.webhooks)) {
		webhooks = options.webhooks;
	} else {
		throw new Error(`Webhooks has to be type 'string', 'object' or 'array'`);
	}

	webhooks = webhooks.map(webhook => {
		if (typeof webhook === 'string') {
			const webhookURLRegex = /(https?):\/\/([a-z0-9]*).*(discordapp.com)\/api(?:\/v([0-9]+))*\/webhooks\/([0-9]{1,20})\/([a-z0-9_-]+)/gi;
			const match = webhookURLRegex.exec(webhook);
			if (match) {
				return { 'id': match[5], 'token': match[6] };
			}

			throw new Error(`Invalid webhook URL: ${webhook}`);

		} else if (typeof webhook === 'object') {
			if (webhook.id && webhook.token) {
				return { 'id': webhook.id, 'token': webhook.token };
			}

			throw new Error(`Webhook has no ID or Token: ${webhook}`);
		}
	});

	this.webhooks = webhooks;
};

util.inherits(DiscordLogger, winston.Transport);

DiscordLogger.prototype.log = function (level, msg, meta, callback) {
	// Make message

	const promises = this.webhooks.map(webhook => {
		return new Promise((resolve, reject) => {
			const body = JSON.stringify({
				content: msg
			});

			const post = {
				hostname: 'discordapp.com',
				path: `/api/v6/webhooks/${webhook.id}/${webhook.token}?wait=true`,
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Content-Length': Buffer.byteLength(body)
				}
			};

			const request = https.request(post, result => {
				result.on('data', data => {
					const response = JSON.parse(data);

					if (response.code)
						return reject(response);

					return resolve(response);
				});
			});

			request.on('error', (e) => {
				return reject(e);
			});

			request.write(body);
			request.end();
		});
	});

	Promise.all(promises).then(results => {
		callback(null, level, msg, meta);
	}).catch(error => {
		callback(error);
	});
};
