# winston-discord
[![npm](https://img.shields.io/npm/v/winston-discord.svg)](https://www.npmjs.com/package/winston-discord)
[![Travis](https://travis-ci.com/bram-codes/winston-discord.svg?branch=master)](https://travis-ci.com/bram-codes/winston-discord)
[![Codecov](https://img.shields.io/codecov/c/github/bram-codes/winston-discord.svg)](https://codecov.io/gh/bram-codes/winston-discord)

A Discord transport for Winston using webhooks

## Usage

```javascript
const winston = require('winston');

// Default winston options +
// the following options are supported
const options = {
	// A single webhook URL
	webhooks: 'https://discordapp.com/api/webhooks/446240708299587584/W_y7cmhCv2KY-oKopLHFTTw08L0apQVS0bkrUDHV44Es4Vb-p3Z4uEEHEwpVkHVjpaqg'
	// Multiple webhooks by URL
	webhooks: [
		'https://discordapp.com/api/webhooks/446240708299587584/W_y7cmhCv2KY-oKopLHFTTw08L0apQVS0bkrUDHV44Es4Vb-p3Z4uEEHEwpVkHVjpaqg',
        	'https://discordapp.com/api/webhooks/446241166493483008/JeOKubEIRAcalZISmjGrG6DuzHX_KdE5Uzq_r0mK0318voc_7TRjC6NA_oe-fYX_eAhn'
	],
	// Single webhook by id and token
	webhooks: {
		id: '446241166493483008',
		token: 'JeOKubEIRAcalZISmjGrG6DuzHX_KdE5Uzq_r0mK0318voc_7TRjC6NA_oe-fYX_eAhn'
	},
	// Multiple webhooks by id and token
	webhooks: [
		{id: '446240708299587584', token: 'W_y7cmhCv2KY-oKopLHFTTw08L0apQVS0bkrUDHV44Es4Vb-p3Z4uEEHEwpVkHVjpaqg'},
		{id: '446241166493483008', token: 'JeOKubEIRAcalZISmjGrG6DuzHX_KdE5Uzq_r0mK0318voc_7TRjC6NA_oe-fYX_eAhn'}
	]
};

const logger = new (winston.Logger)({
		transports: [
			new (DiscordLogger)(options)
		]
	});

	logger.log('info', 'Hi discord!');
```

## Planned functionality
* Metadata
* Log levels
* Embeds
* Overwriting username and avatar_url