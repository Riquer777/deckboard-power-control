const test = require('node:test');
const assert = require('node:assert/strict');
const Module = require('node:module');

test('mapeia desligar e reiniciar para os comandos systemctl corretos', async () => {
	const calls = [];
	const originalLoad = Module._load;

	class MockExtension {}

	Module._load = function (request, parent, isMain) {
		if (request === 'node:child_process') {
			return {
				execFile: (file, args, options, callback) => {
					calls.push({ file, args, options });
					callback(null, '', '');
				}
			};
		}
		if (request === 'electron') {
			return {
				dialog: {
					showMessageBox: async () => ({ response: 1 })
				}
			};
		}
		if (request === 'deckboard-kit') {
			return {
				Extension: MockExtension,
				Platforms: { linux: 'LINUX' },
				Icons: { ionicons: 'ion' },
				log: { info() {}, warn() {}, error() {} }
			};
		}
		return originalLoad.call(this, request, parent, isMain);
	};

	try {
		const extensionPath = require.resolve('../index.js');
		delete require.cache[extensionPath];
		const extension = require('../index.js');

		assert.deepEqual(extension.platforms, ['LINUX']);
		await extension.execute('shutdown');
		await extension.execute('restart');

		assert.deepEqual(calls.map(call => call.file), [
			'/usr/bin/systemctl',
			'/usr/bin/systemctl'
		]);
		assert.deepEqual(calls.map(call => call.args), [
			['poweroff'],
			['reboot']
		]);
		assert.ok(calls.every(call => call.options.timeout === 10000));
	} finally {
		Module._load = originalLoad;
	}
});
