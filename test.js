const process = require('process');
const test = require('ava');
const winston = require('winston');
const DiscordLogger = require('./index');

const webhooksByUrl = require('./webhooks-by-url');
const webhooksByIdAndToken = require('./webhooks-by-id-and-token');

test('accept webhook url', t => {
	const logger = new (winston.Logger)({
		transports: [
			new (DiscordLogger)({ webhooks: webhooksByUrl[0] })
		]
	});

	const webhooks = logger.transports.DiscordLogger.webhooks;

	t.is(webhooks[0].id, '446240708299587584');
	t.is(webhooks[0].token, 'W_y7cmhCv2KY-oKopLHFTTw08L0apQVS0bkrUDHV44Es4Vb-p3Z4uEEHEwpVkHVjpaqg');
});

test('accept array of webhook urls', t => {
	const logger = new (winston.Logger)({
		transports: [
			new (DiscordLogger)({ webhooks: webhooksByUrl })
		]
	});

	const webhooks = logger.transports.DiscordLogger.webhooks;

	t.is(webhooks[0].id, '446240708299587584');
	t.is(webhooks[0].token, 'W_y7cmhCv2KY-oKopLHFTTw08L0apQVS0bkrUDHV44Es4Vb-p3Z4uEEHEwpVkHVjpaqg');
	t.is(webhooks[1].id, '446241166493483008');
	t.is(webhooks[1].token, 'JeOKubEIRAcalZISmjGrG6DuzHX_KdE5Uzq_r0mK0318voc_7TRjC6NA_oe-fYX_eAhn');
});

test('accept webhook id and token object', t => {
	const logger = new (winston.Logger)({
		transports: [
			new (DiscordLogger)({ webhooks: webhooksByIdAndToken[0] })
		]
	});

	const webhooks = logger.transports.DiscordLogger.webhooks;

	t.is(webhooks[0].id, '446240708299587584');
	t.is(webhooks[0].token, 'W_y7cmhCv2KY-oKopLHFTTw08L0apQVS0bkrUDHV44Es4Vb-p3Z4uEEHEwpVkHVjpaqg');
});

test('accept array of webhook id and token objects', t => {
	const logger = new (winston.Logger)({
		transports: [
			new (DiscordLogger)({ webhooks: webhooksByIdAndToken })
		]
	});

	const webhooks = logger.transports.DiscordLogger.webhooks;

	t.is(webhooks[0].id, '446240708299587584');
	t.is(webhooks[0].token, 'W_y7cmhCv2KY-oKopLHFTTw08L0apQVS0bkrUDHV44Es4Vb-p3Z4uEEHEwpVkHVjpaqg');
	t.is(webhooks[1].id, '446241166493483008');
	t.is(webhooks[1].token, 'JeOKubEIRAcalZISmjGrG6DuzHX_KdE5Uzq_r0mK0318voc_7TRjC6NA_oe-fYX_eAhn');
});

test.cb('send simple log message', t => {
	const logger = new (winston.Logger)({
		transports: [
			new (DiscordLogger)({ webhooks: { id: process.env.WEBHOOK_ID, token: process.env.WEBHOOK_TOKEN } })
		]
	});

	logger.log('error', 'This is a simple log message', (error, level, message, meta) => {
		t.is(message, 'This is a simple log message');
		t.end();
	});
});
