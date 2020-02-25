import init, { JsBusicom141PF } from './emu.js';

const buttons = document.getElementById('buttons');
const feed_paper = document.getElementById('feed-paper');
const digit_point = document.getElementById('digit-point');
const rounding = document.getElementById('rounding');
const lamp_ovf = document.getElementById('lamp-ovf');
const lamp_sig = document.getElementById('lamp-sig');
const lamp_mem = document.getElementById('lamp-mem');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let device;

const charset = [
	['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '.', '-'],
	['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '.', '-'],
	['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '.', '-'],
	['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '.', '-'],
	['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '.', '-'],
	['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '.', '-'],
	['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '.', '-'],
	['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '.', '-'],
	['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '.', '-'],
	['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '.', '-'],
	['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '.', '-'],
	['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '.', '-'],
	['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '.', '-'],
	['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '.', '-'],
	['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '.', '-'],
	[],
	['\u22C4', '+', '-', '\u2A2F', '\u00F7', 'M+', 'M-', '\u2197', '=', '\u221A', '%', 'C', 'R'],
	['#', '*', '\u222B', '\u222C', '\u222D', 'M+', 'M-', 'T', 'K', 'E', 'Ex', 'C', 'M'],
];

window.cb_fire = function(col, row, red) {
	const text = charset[col][row];
	ctx.font = 'bold 16px Courier New';
	ctx.fillStyle = red ? 'red' : 'black';
	ctx.textBaseline = 'bottom';
	ctx.fillText(text, col * 24, canvas.height);
};
window.cb_advance = function() {
	let data = ctx.getImageData(0, 0, canvas.width, canvas.height);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.putImageData(data, 0, -16);
};

(async function() {
	await init();
	device = new JsBusicom141PF();

	let lastTime = null;
	requestAnimationFrame(function render(time) {
		if (canvas.width != canvas.clientWidth)
			canvas.width = canvas.clientWidth;
		if (canvas.height != canvas.clientHeight)
			canvas.height = canvas.clientHeight;
		if (lastTime !== null)
			device.update((time - lastTime) / 10000);
		lamp_ovf.checked = device.lamp_ovf;
		lamp_sig.checked = device.lamp_sig;
		lamp_mem.checked = device.lamp_mem;
		lastTime = time;
		requestAnimationFrame(render);
	});

	for (let button of buttons.children) {
		const index = button.getAttribute('data').split(',');
		button.addEventListener('mousedown', function() {
			device.key_matrix(index[0], index[1], true);
		});
		button.addEventListener('mouseup', function() {
			device.key_matrix(index[0], index[1], false);
		});
	}
	
	feed_paper.addEventListener('mousedown', function() {
		device.paper_feed = true;
	});
	feed_paper.addEventListener('mouseup', function() {
		device.paper_feed = false;
	});

	digit_point.addEventListener('change', function() {
		device.digit_point(digit_point.value);
	});
	device.digit_point(digit_point.value);
	rounding.addEventListener('change', function() {
		device.rounding(rounding.value);
	});
	device.rounding(rounding.value);
})();