use mcs4::*;

fn nop_fire(_: u8, _: u8, _: bool) {}
fn nop_advance() {}

pub struct Busicom141PF {
	pub paper_feed: bool,
	pub key_matrix: [u8; 10],
	pub lamp_mem: bool,
	pub lamp_ovf: bool,
	pub lamp_sig: bool,
	pub cb_fire: fn(u8, u8, bool),
	pub cb_advance: fn(),
	
	time: f64,
	print_row: u8,
	last_advance: bool,
	last_fire: [bool; 18],
	cycles: u64,
	red: bool,

	rom: [I4001; 5],
	ram: [I4002; 2],
	shift: [I4003; 3],
	cpu: [I4004; 1],
}

impl Busicom141PF {
	pub fn new() -> Self {
		let data = include_bytes!("busicom_141pf.bin");
		let mut code = [[0u8; 256]; 5];
		for i in 0..5 {
			let slice = &data[i * 256 .. (i + 1) * 256];
			for (dst, src) in code[i].iter_mut().zip(slice) {
				*dst = *src;
			}
		}
		Busicom141PF {
			paper_feed: false,
			key_matrix: [0; 10],
			lamp_mem: false,
			lamp_ovf: false,
			lamp_sig: false,
			cb_fire: nop_fire,
			cb_advance: nop_advance,

			time: 0.0,
			print_row: 0,
			last_advance: false,
			last_fire: [false; 18],
			cycles: 0,
			red: false,

			rom: [
				I4001::new(code[0], 0, 0xF, 0x0, 0x0),
				I4001::new(code[1], 1, 0x0, 0x0, 0x0),
				I4001::new(code[2], 2, 0x0, 0x0, 0x0),
				I4001::new(code[3], 3, 0x0, 0x0, 0x0),
				I4001::new(code[4], 4, 0x0, 0x0, 0x0),
			],
			ram: [
				I4002::new(false),
				I4002::new(false),
			],
			shift: [
				I4003::new(),
				I4003::new(),
				I4003::new(),
			],
			cpu: [
				I4004::new(),
			],
		}
	}

	pub fn update(&mut self, delta: f64) {
		if self.paper_feed {
			self.rom[2].port |= 0x8;
		} else {
			self.rom[2].port &= 0x7;
		}
		let mut start_time = self.time - self.time % 0.00000135;
		self.time += delta;
		while start_time + 0.00000135 < self.time {
			self.cpu_clock();
			self.cycles += 1;
			if self.cycles % 8 == 0 {
				self.circuit_clock();
			}
			if self.cycles % 10370 == 0 {
				self.printer_clock();
			}
			start_time += 0.00000135;
		}
		self.lamp_mem = self.ram[1].port & 0x1 != 0;
		self.lamp_ovf = self.ram[1].port & 0x2 != 0;
		self.lamp_sig = self.ram[1].port & 0x4 != 0;
	}

	fn cpu_clock(&mut self) {
		let mut data = 0;
		self.ram[0].p0 = false;
		self.ram[1].p0 = true;
		for rom in self.rom.iter_mut() { rom.leading_clock() }
		for ram in self.ram.iter_mut() { ram.leading_clock() }
		for cpu in self.cpu.iter_mut() { cpu.leading_clock() }
		data |= self.rom.iter().fold(0, |acc, rom| acc | rom.data);
		data |= self.ram.iter().fold(0, |acc, ram| acc | ram.data);
		data |= self.cpu.iter().fold(0, |acc, cpu| acc | cpu.data);
		for rom in self.rom.iter_mut() { rom.data = data }
		for ram in self.ram.iter_mut() { ram.data = data }
		for cpu in self.cpu.iter_mut() { cpu.data = data }
		for rom in self.rom.iter_mut() { rom.sync = self.cpu[0].sync }
		for ram in self.ram.iter_mut() { ram.sync = self.cpu[0].sync }
		for rom in self.rom.iter_mut() { rom.cm = self.cpu[0].rom }
		for ram in self.ram.iter_mut() { ram.cm = self.cpu[0].rom }
		for rom in self.rom.iter_mut() { rom.cl = false }
		for rom in self.rom.iter_mut() { rom.trailing_clock() }
		for ram in self.ram.iter_mut() { ram.trailing_clock() }
		for cpu in self.cpu.iter_mut() { cpu.trailing_clock() }
	}

	fn circuit_clock(&mut self) {
		self.shift[0].enable = true;
		self.shift[0].clock = self.rom[0].port & 0x1 != 0;
		self.shift[0].input = self.rom[0].port & 0x2 != 0;
		self.shift[0].update();
		self.shift[1].enable = self.ram[0].port & 0x2 != 0;
		self.shift[1].clock = self.rom[0].port & 0x4 != 0;
		self.shift[1].input = self.rom[0].port & 0x2 != 0;
		self.shift[1].update();
		self.shift[2].enable = self.ram[0].port & 0x2 != 0;
		self.shift[2].clock = self.rom[0].port & 0x4 != 0;
		self.shift[2].input = self.shift[1].serial;
		self.shift[2].update();
		self.rom[1].port = 0;
		for i in 0..10 {
			if self.shift[0].output >> i & 1 == 0 {
				self.rom[1].port |= self.key_matrix[i];
			}
		}
		let shift_map = [
			(1, 3), (1, 4), (1, 5), (1, 6), (1, 7), (1, 8),
			(1, 9), (2, 0), (2, 1), (2, 2), (2, 3), (2, 4),
			(2, 5), (2, 6), (2, 7), (0, 0), (1, 0), (1, 1),
		];
		if self.ram[0].port & 0x1 != 0 {
			self.red = true;
		}
		for i in 0..18 {
			if i == 15 { continue }
			let shift = self.shift[shift_map[i].0].output;
			let fire = shift >> shift_map[i].1 & 1 != 0;
			if fire && !self.last_fire[i] {
				(self.cb_fire)(i as u8, self.print_row, self.red);
			}
			self.last_fire[i] = fire;
		}
		let advance = self.ram[0].port & 0x8 != 0;
		if advance && !self.last_advance {
			(self.cb_advance)();
			self.red = false;
		}
		self.last_advance = advance;
	}

	fn printer_clock(&mut self) {
		self.cpu[0].test = !self.cpu[0].test;
		if self.cpu[0].test {
			self.print_row = (self.print_row + 1) % 13;
			if self.print_row == 0 {
				self.rom[2].port |= 0x1;
			} else {
				self.rom[2].port &= 0xE;
			}
		}
	}
}