const winston = require('winston');
const util = require('util');
const https = require('https');

const defaultColors = {
	error: 0xE8341C,
	warn: 0xF2D42C,
	info: 0x68C244,
	verbose: 0x1CC3E8,
	debug: 0xFF70FF,
	silly: 0x999999,
};

const noColor = 0x36393E;

module.exports = DiscordLogger = winston.transports.DiscordLogger = function(options) {
	this.name = options.name || 'DiscordLogger';
	this.level = options.level || 'info';

	this.colors = options.colors || options.colors === false ? false : defaultColors;
	if (typeof options.colors === 'object')
		this.colors = options.colors;

	this.inline = options.inline;

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

		} else if (typeof webhook === 'object' && webhook.id && webhook.token) {
			return {'id': webhook.id, 'token': webhook.token};
		} else {
			throw new Error(`Webhook has no or invalid ID or Token: ${webhook}`);
		}
	});

	this.webhooks = webhooks;
};

util.inherits(DiscordLogger, winston.Transport);

DiscordLogger.prototype.log = function (level, msg, meta, callback) {
	const promises = this.webhooks.map(webhook => {
		return new Promise((resolve, reject) => {

			const fields = Object.keys(meta).map(key => {
				let inline = true;
				if (typeof this.inline === 'object') {
					if (typeof this.inline[key] !== 'undefined'){
						inline = this.inline[key];
					}
				} else {
					inline = this.inline;
				}

				return { name: key, value: meta[key], inline: inline }
			});

			// Request body
			let body = JSON.stringify({
				embeds: [{
					title: level.charAt(0).toUpperCase() + level.slice(1),
					description: msg,
					color: this.colors ? this.colors[level] : noColor,
					fields: fields,
					timestamp: new Date().toISOString()
				}]
			});

			// Post details
			const post = {
				hostname: 'discordapp.com',
				path: `/api/v6/webhooks/${webhook.id}/${webhook.token}?wait=true`,
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Content-Length': Buffer.byteLength(body)
				}
			};

			// Request
			const request = https.request(post, result => {
				let chunks = [];

				result.on('data', data => {
					chunks.push(data);
				});

				result.on('end', () => {
					let data = Buffer.concat(chunks);
					const response = JSON.parse(data);

					if (response.code)
						return reject(response);

					return resolve(response);
				});
			});

			request.write(body);
			request.end();
		});
	});

	Promise.all(promises).then(results => {
		let lvl = results[0].embeds[0].title;
		let message = results[0].embeds[0].description;
		let metadata = !results[0].embeds[0].fields ? null : results[0].embeds[0].fields.map((field) => {
			return {[field.name]: field.value};
		});

		callback(null, lvl, message, metadata);
	}).catch(error => {
		callback(error);
	});
};
