const winston = require('winston');
const util = require('util');
const https = require('https');

module.exports = DiscordLogger = winston.transports.DiscordLogger = function(options) {
	this.name = options.name || 'DiscordLogger';
	this.level = options.level || 'info';

	let webhooks = [];
	if (typeof options.webhooks === 'string' || (typeof options.webhooks === 'object' && !Array.isArray(options.webhooks))) {
		webhooks.push(options.webhooks)
	} else if (Array.isArray(options.webhooks)) {
		webhooks = options.webhooks;
	}

	webhooks = webhooks.map(webhook => {
		if (typeof webhook === 'string') {
			const webhookURLRegex = /(https?):\/\/([(a-z0-9).]+)\/api(?:\/v([0-9]+))*\/webhooks\/([0-9]{1,20})\/([a-z0-9_-]+)/gi;
			const match = webhookURLRegex.exec(webhook);
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
				path: `/api/v6/webhooks/${webhook.id}/${webhook.token}`,
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Content-Length': Buffer.byteLength(body)
				}
			};

			const request = https.request(post, result => {
				result.setEncoding('utf8');
				result.on('data', chunk => {
					console.log('Response: ' + chunk);
				});
			});

			request.write(body, 'utf8', result => {
				console.log(result);
				return resolve(result);
			});
		});
	});

	Promise.all(promises).then(results => {
		console.log(results);

		callback(null, level, msg, meta);
	}).catch(error => {
		callback(error);
	});
};
