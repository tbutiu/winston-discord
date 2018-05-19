const process = require('process');
const test = require('ava');
const winston = require('winston');
const DiscordLogger = require('./index');

const webhooksByUrl = require('./webhooks-by-url');
const webhooksByIdAndToken = require('./webhooks-by-id-and-token');

const webhookObjects = [
	{id: '446240708299587584', token: 'W_y7cmhCv2KY-oKopLHFTTw08L0apQVS0bkrUDHV44Es4Vb-p3Z4uEEHEwpVkHVjpaqg'},
	{id: '446241166493483008', token: 'JeOKubEIRAcalZISmjGrG6DuzHX_KdE5Uzq_r0mK0318voc_7TRjC6NA_oe-fYX_eAhn'}
];

const webhookUrls = [
	'https://discordapp.com/api/webhooks/446240708299587584/W_y7cmhCv2KY-oKopLHFTTw08L0apQVS0bkrUDHV44Es4Vb-p3Z4uEEHEwpVkHVjpaqg',
	'https://discordapp.com/api/webhooks/446241166493483008/JeOKubEIRAcalZISmjGrG6DuzHX_KdE5Uzq_r0mK0318voc_7TRjC6NA_oe-fYX_eAhn'
];

test('accept webhook url', t => {
	const logger = new (winston.Logger)({ transports: [new (DiscordLogger)({ webhooks: webhooksByUrl[0] })] });
	const webhooks = logger.transports.DiscordLogger.webhooks;

	t.is(webhooks[0].id, '446240708299587584');
	t.is(webhooks[0].token, 'W_y7cmhCv2KY-oKopLHFTTw08L0apQVS0bkrUDHV44Es4Vb-p3Z4uEEHEwpVkHVjpaqg');
});

test('accept array of webhook urls', t => {
	const logger = new (winston.Logger)({ transports: [new (DiscordLogger)({ webhooks: webhooksByUrl })] });
	const webhooks = logger.transports.DiscordLogger.webhooks;

	t.is(webhooks[0].id, '446240708299587584');
	t.is(webhooks[0].token, 'W_y7cmhCv2KY-oKopLHFTTw08L0apQVS0bkrUDHV44Es4Vb-p3Z4uEEHEwpVkHVjpaqg');
	t.is(webhooks[1].id, '446241166493483008');
	t.is(webhooks[1].token, 'JeOKubEIRAcalZISmjGrG6DuzHX_KdE5Uzq_r0mK0318voc_7TRjC6NA_oe-fYX_eAhn');
});

test('accept webhook id and token object', t => {
	const logger = new (winston.Logger)({ transports: [new (DiscordLogger)({ webhooks: webhooksByIdAndToken[0] })] });
	const webhooks = logger.transports.DiscordLogger.webhooks;

	t.is(webhooks[0].id, '446240708299587584');
	t.is(webhooks[0].token, 'W_y7cmhCv2KY-oKopLHFTTw08L0apQVS0bkrUDHV44Es4Vb-p3Z4uEEHEwpVkHVjpaqg');
});

test('accept array of webhook id and token objects', t => {
	const logger = new (winston.Logger)({ transports: [new (DiscordLogger)({ webhooks: webhooksByIdAndToken })] });
	const webhooks = logger.transports.DiscordLogger.webhooks;

	t.is(webhooks[0].id, '446240708299587584');
	t.is(webhooks[0].token, 'W_y7cmhCv2KY-oKopLHFTTw08L0apQVS0bkrUDHV44Es4Vb-p3Z4uEEHEwpVkHVjpaqg');
	t.is(webhooks[1].id, '446241166493483008');
	t.is(webhooks[1].token, 'JeOKubEIRAcalZISmjGrG6DuzHX_KdE5Uzq_r0mK0318voc_7TRjC6NA_oe-fYX_eAhn');
});

test('throw when webhooks option is not set', t => {
	const errorEmpty = t.throws(() => {
		new (winston.Logger)({ transports: [new (DiscordLogger)({ level: 'silly' })]});
	});
	t.is(errorEmpty.message, 'Webhooks have to be set in options');

	const errorNull = t.throws(() => {
		new (winston.Logger)({ transports: [new (DiscordLogger)({ webhooks: null })]});
	});
	t.is(errorNull.message, 'Webhooks have to be set in options');

	const errorUndefined = t.throws(() => {
		new (winston.Logger)({ transports: [new (DiscordLogger)({ webhooks: undefined })]});
	});
	t.is(errorUndefined.message, 'Webhooks have to be set in options');
});

test('do not accept webhooks option that is not a string, object or array', t => {
	const errorBool = t.throws(() => {
		new (winston.Logger)({ transports: [new (DiscordLogger)({ webhooks: true })] });
	});
	t.is(errorBool.message, `Webhooks has to be type 'string', 'object' or 'array'`);

	const errorNumber = t.throws(() => {
		new (winston.Logger)({ transports: [new (DiscordLogger)({ webhooks: 12345 })] });
	});
	t.is(errorNumber.message, `Webhooks has to be type 'string', 'object' or 'array'`);
});

test('do not accept non-discord domains', t => {
	const invalid = 'https://notdiscord.com/api/webhooks/446240708299587584/W_y7cmhCv2KY-oKopLHFTTw08L0apQVS0bkrUDHV44Es4Vb-p3Z4uEEHEwpVkHVjpaqg';
	const error = t.throws(() => {
		new (winston.Logger)({ transports: [new (DiscordLogger)({ webhooks: invalid })]});
	});
	t.is(error.message, `Invalid webhook URL: ${invalid}`);
});

test('missing id or token', t => {
	const webhook = { id: '446240708299587584', tokn: 'W_y7cmhCv2KY-oKopLHFTTw08L0apQVS0bkrUDHV44Es4Vb-p3Z4uEEHEwpVkHVjpaqg' };
	const error = t.throws(() => {
		new (winston.Logger)({ transports: [new (DiscordLogger)({ webhooks: webhook })]});
	});
	t.is(error.message, `Webhook has no or invalid ID or Token: ${webhook}`);
});

test.cb('invalid id or token', t => {
	const logger = new (winston.Logger)({ transports: [new (DiscordLogger)({ webhooks: webhookObjects[0] })] });

	logger.log('info', 'Some message', (error, level, msg, meta) => {
		if (error) {
			t.is(error.code, 10015);
			t.is(error.message, 'Unknown Webhook');
		} else {
			t.fail();
		}

		t.end();
	})
});

test.cb('simple log message', t => {
	const logger = new (winston.Logger)({ transports: [new (DiscordLogger)({ webhooks: { id: process.env.WEBHOOK_ID, token: process.env.WEBHOOK_TOKEN } })] });
	const message = 'This is just some general info, nothing special';

	logger.log('info', message, (error, level, msg, meta) => {
		t.is(level, 'info');
		t.is(msg, message);
		t.deepEqual(meta, {});
		t.end();
	});
});

test.cb('log message with meta', t => {
	const logger = new (winston.Logger)({ transports: [new (DiscordLogger)({ webhooks: { id: process.env.WEBHOOK_ID, token: process.env.WEBHOOK_TOKEN } })] });
	const message = 'Oh no! Something went wrong with a process! :O';
	const metadata = { processID: 1634, processName: 'SomeProcess', reason: 'It totally bailed on us' };

	logger.log('error', message, metadata, (error, level, msg, meta) => {
		t.is(level, 'error');
		t.is(msg, message);
		t.is(meta, metadata);
		t.end();
	});
});

test.cb('custom color', t => {
	const logger = new (winston.Logger)({ transports: [new (DiscordLogger)({ colors: {'warn': 0xF58A07}, webhooks: { id: process.env.WEBHOOK_ID, token: process.env.WEBHOOK_TOKEN } })] });
	const message = 'Vinny, come over here and take a look at this. This doesn\'t look too good man!';

	logger.log('warn', message, (error, level, msg, meta) => {
		t.is(level, 'warn');
		t.is(msg, message);
		t.deepEqual(meta, {});
		t.end();
	});
});

test.cb('no color', t => {
	const logger = new (winston.Logger)({ transports: [new (DiscordLogger)({ colors: false, webhooks: { id: process.env.WEBHOOK_ID, token: process.env.WEBHOOK_TOKEN } })] });
	const message = 'This embed looks rather dull';

	logger.log('info', message, (error, level, msg, meta) => {
		t.is(level, 'info');
		t.is(msg, message);
		t.deepEqual(meta, {});
		t.end();
	});
});

test.cb('set inline per meta field', t => {
	const logger = new (winston.Logger)({ transports: [new (DiscordLogger)({ inline: {inline: true, thistoo: true, notinline: false}, webhooks: { id: process.env.WEBHOOK_ID, token: process.env.WEBHOOK_TOKEN } })] });
	const message = 'We sometimes love inline';
	const metadata = {
		inline: 'This will be inline',
		thistoo: 'Yep this one too',
		notinline: 'This is not inline',
		notevendefined: 'This one is not defined and will default to inline',
		alsoundefined: 'Yea same'
	};

	logger.log('info', message, metadata, (error, level, msg, meta) => {
		t.is(level, 'info');
		t.is(msg, message);
		t.deepEqual(meta, metadata);
		t.end();
	});
});