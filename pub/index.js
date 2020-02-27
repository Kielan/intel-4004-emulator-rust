import init, { JsBusicom141PF } from './emu.js';

const drags = document.getElementsByClassName('drag');
const buttons = document.getElementById('buttons');
const feed_paper = document.getElementById('feed-paper');
const digit_point = document.getElementById('digit-point');
const rounding = document.getElementById('rounding');
const lamp_ovf = document.getElementById('lamp-ovf');
const lamp_sig = document.getElementById('lamp-sig');
const lamp_mem = document.getElementById('lamp-mem');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const data_settings = document.getElementById('data-settings');
const data_reset = document.getElementById('data-reset');
const data_cycle = document.getElementById('data-cycle');
const data_instr = document.getElementById('data-instr');
const data_speed = document.getElementById('data-speed');
const data_ram0 = document.getElementById('data-ram0');
const data_ram1 = document.getElementById('data-ram1');
const data_cpu0 = document.getElementById('data-cpu0');
const menu_settings = document.getElementById('settings')
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
	ctx.fillStyle = red ? '#711' : '#111';
	ctx.textBaseline = 'bottom';
	ctx.fillText(text, col * 24, canvas.height);
};
window.cb_advance = function() {
	let data = ctx.getImageData(0, 0, canvas.width, canvas.height);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.putImageData(data, 0, -16);
};

function hex(i, p) {
	const str = i.toString(16);
	return '0'.repeat(p - str.length) + str;
}

function str_ram(device) {
	let result = '';
	const ram = device.get_ram();
	const stat = device.get_stat();
	result += '<span class="ft-gray">  0123456789abcdef 0123</span>\n';
	for (let r = 0; r < 4; ++r) {
		result += '<span class="ft-gray">R' + hex(r, 1) + '</span>';
		for (let c = 0; c < 16; ++c)
			result += hex(ram[r * 16 + c], 1);
		result += ' ';
		for (let c = 0; c < 4; ++c)
			result += hex(stat[r * 4 + c], 1);
		result += '\n';
	}
	return result;
}

function str_cpu(device) {
	let result = '';
	const reg = device.get_reg();
	const stack = device.get_stack();
	for (let r = 0; r < 4; ++r) {
		if (r == device.sptr) {
			result += '>' + hex(stack[r], 3) + ' ';
		} else {
			result += ' ' + hex(stack[r], 3) + ' ';
		}
		result += '<span class="ft-gray">' + hex(r + 0, 1) + 'P</span>';
		result += hex(reg[r * 2 + 0], 1) + hex(reg[r * 2 + 1], 1) + ' ';
		result += '<span class="ft-gray">' + hex(r + 4, 1) + 'P</span>';
		result += hex(reg[r * 2 + 8], 1) + hex(reg[r * 2 + 9], 1) + ' ';
		if (r == 0) {
			const phases = ['A1', 'A2', 'A3', 'M1', 'M2', 'X1', 'X2', 'X3'];
			result += phases[device.phase] + '<span class="ft-gray">D</span>' + hex(device.data, 1);
		} else if (r == 1) {
			result += '<span class="ft-gray">A</span>' + hex(device.acc, 1);
			result += '<span class="ft-gray">C</span>' + hex(device.carry ? 1 : 0, 1);
		} else if (r == 2) {
			result += '<span class="ft-gray">RARA</span>';
		} else if (r == 3) {
			result += hex(device.instr, 2) + hex(device.arg, 2);
		}
		result += '\n';
	}
	return result;
}

(async function() {
	await init();
	device = new JsBusicom141PF();

	let dragging = null;
	for (let drag of drags) {
		drag.addEventListener('mousedown', function(e) {
			const block = ['INPUT', 'BUTTON', 'TEXTAREA'];
			if (!block.includes(e.target.tagName)) {
				dragging = drag;
			}
		});
	}
	window.addEventListener('mouseup', function() {
		dragging = null;
	});
	window.addEventListener('mousemove', function(e) {
		if (dragging !== null) {
			const rect = dragging.getBoundingClientRect();
			dragging.style.top = (rect.top + e.movementY) + 'px';
			dragging.style.left = (rect.left + e.movementX) + 'px';
		}
	});

	let lastTime = null;
	requestAnimationFrame(function render(time) {
		if (lastTime !== null) {
			let delta = time - lastTime;
			delta = Math.min(delta, 1000);
			device.update(delta / 1000 * data_speed.value);
		}
		data_ram0.innerHTML = str_ram(device.get_ram(0));
		data_ram1.innerHTML = str_ram(device.get_ram(1));
		data_cpu0.innerHTML = str_cpu(device.get_cpu(0));
		lamp_ovf.classList.toggle('lit', device.lamp_ovf);
		lamp_sig.classList.toggle('lit', device.lamp_sig);
		lamp_mem.classList.toggle('lit', device.lamp_mem);
		lastTime = time;
		requestAnimationFrame(render);
	});

	data_settings.addEventListener('click', function() {
		menu_settings.classList.toggle('hidden');
	});
	data_reset.addEventListener('click', function() {
		device.reset();
	});
	data_cycle.addEventListener('click', function() {
		device.update(0.00000135);
	});
	data_instr.addEventListener('click', function() {
		device.update(0.00001080);
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

	const dp_map = [0, 1, 2, 3, 4, 5, 6, 8];
	digit_point.addEventListener('change', function() {
		device.digit_point(dp_map[digit_point.value]);
	});
	device.digit_point(dp_map[digit_point.value]);
	const rs_map = [8, 0, 1];
	rounding.addEventListener('change', function() {
		device.rounding(rs_map[rounding.value]);
	});
	device.rounding(rs_map[rounding.value]);
})();