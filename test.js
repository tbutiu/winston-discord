const test = require('ava');
const winston = require('winston');
const DiscordLogger = require('./index');

const webhooksByUrl = require('./webhooks-by-url');
const webhooksByIdAndToken = require('./webhooks-by-id-and-token');

winston.remove(winston.transports.Console);

test('accept webhook url', t => {
	const result = winston.add(DiscordLogger, { webhooks: webhooksByUrl[0] });

	t.is(result, { 'id': '446240708299587584', 'token': 'W_y7cmhCv2KY-oKopLHFTTw08L0apQVS0bkrUDHV44Es4Vb-p3Z4uEEHEwpVkHVjpaqg' });
});

test('accept array of webhook urls', t => {
	const result = winston.add(DiscordLogger, { webhooks: webhooksByUrl });

	t.is(result, [
		{ 'id': '446240708299587584', 'token': 'W_y7cmhCv2KY-oKopLHFTTw08L0apQVS0bkrUDHV44Es4Vb-p3Z4uEEHEwpVkHVjpaqg' },
		{ 'id': '446241166493483008', 'token': 'JeOKubEIRAcalZISmjGrG6DuzHX_KdE5Uzq_r0mK0318voc_7TRjC6NA_oe-fYX_eAhn' }
	]);
});

test('accept webhook id and token object', t => {
	const result = winston.add(DiscordLogger, { webhooks: webhooksByIdAndToken[0] });
	t.is(result, { 'id': '446240708299587584', 'token': 'W_y7cmhCv2KY-oKopLHFTTw08L0apQVS0bkrUDHV44Es4Vb-p3Z4uEEHEwpVkHVjpaqg' });
});

test('accept array of webhook id and token objects', t => {
	const result = winston.add(DiscordLogger, { webhooks: webhooksByIdAndToken });
	t.is(result, [
		{ 'id': '446240708299587584', 'token': 'W_y7cmhCv2KY-oKopLHFTTw08L0apQVS0bkrUDHV44Es4Vb-p3Z4uEEHEwpVkHVjpaqg' },
		{ 'id': '446241166493483008', 'token': 'JeOKubEIRAcalZISmjGrG6DuzHX_KdE5Uzq_r0mK0318voc_7TRjC6NA_oe-fYX_eAhn' }
	]);
});

// test('don\'t accept urls that are not from discord', t => {
//
// });

