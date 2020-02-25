const http = require('http');
const fs = require('fs');

const routes = {
	'/': { file: 'public/index.html', type: 'text/html' },
	'/index.css': { file: 'public/index.css', type: 'text/css' },
	'/index.js': { file: 'public/index.js', type: 'application/javascript' },
	'/emu.js': { file: 'public/emu.js', type: 'application/javascript' },
	'/emu_bg.wasm': { file: 'public/emu_bg.wasm', type: 'application/wasm' },
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