const http = require('http');
const fs = require('fs');

const routes = {
	'/': { file: 'pub/index.html', type: 'text/html' },
	'/index.css': { file: 'pub/index.css', type: 'text/css' },
	'/index.js': { file: 'pub/index.js', type: 'application/javascript' },
	'/emu.js': { file: 'pub/emu.js', type: 'application/javascript' },
	'/emu_bg.wasm': { file: 'pub/emu_bg.wasm', type: 'application/wasm' },
};

http.createServer((req, res) => {
	const route = routes[req.url];
	if (route !== undefined) {
		res.setHeader('Content-Type', route.type);
		fs.createReadStream(route.file).pipe(res);
	} else {
		res.statusCode = 404;
		res.end();
	}
}).listen(process.env.PORT);