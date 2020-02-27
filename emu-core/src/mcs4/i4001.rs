pub struct I4001 {
	rom: [u8; 256],
	id: u8,
	out: u8,
	inv: u8,
	mask: u8,
	wild: bool,

	pub data: u8,
	pub cm: bool,
	pub cl: bool,
	pub sync: bool,
	pub port: u8,

	phase: u8,
	addr: u8,
	select: bool,
	opa: u8,
	src: u8,
}

impl I4001 {
	pub fn new(rom: [u8; 256], id: u8, out: u8, inv: u8, mask: u8) -> Self {
		I4001 {
			rom: rom,
			id: id & 0xF,
			out: out & 0xF,
			inv: inv & 0xF,
			mask: mask & (out ^ 0xF),
			wild: id > 0xF,

			data: 0,
			cm: false,
			cl: false,
			sync: true,
			port: inv & out,

			phase: 0,
			addr: 0,
			select: false,
			opa: 0,
			src: 0,
		}
	}

	pub fn reset(&mut self) {
		self.port ^= (self.port ^ self.inv) & self.out;
		self.phase = 0;
		self.src = 0;
	}

	pub fn leading_clock(&mut self) {
		self.data = 0;
		if self.phase == 3 {
			if self.select {
				self.data = (self.rom[self.addr as usize] >> 4 & 0xF) as u8;
			}
		} else if self.phase == 4 {
			if self.select {
				self.data = (self.rom[self.addr as usize] >> 0 & 0xF) as u8;
			}
		} else if self.phase == 6 {
			if self.opa == 0xA && self.select {
				let result = self.port ^ self.inv;
				self.data = result & (self.out ^ 0xF) | self.mask;
			}
		}
	}

	pub fn trailing_clock(&mut self) {
		if self.phase == 0 {
			self.addr = self.addr & 0xF0 | self.data << 0 & 0x0F;
		} else if self.phase == 1 {
			self.addr = self.addr & 0x0F | self.data << 4 & 0xF0;
		} else if self.phase == 2 {
			self.select = self.id == self.data & 0xF && self.cm;
			self.select = self.select || self.wild;
		} else if self.phase == 4 {
			self.select = self.id == self.src >> 4 & 0xF && self.cm;
			self.select = self.select || self.wild;
			self.opa = self.data & 0xF;
		} else if self.phase == 6 {
			if self.opa == 0x2 && self.select {
				self.port ^= (self.port ^ self.data ^ self.inv) & self.out;
			}
			self.select = self.cm;
			if self.select {
				self.src = self.src & 0x0F | self.data << 4 & 0xF0;
			}
		} else if self.phase == 7 {
			if self.select {
				self.src = self.src & 0xF0 | self.data << 0 & 0x0F;
			}
		}
		if self.cl {
			self.port ^= (self.port ^ self.inv) & self.out;
		}
		self.phase += 1;
		if self.sync {
			self.phase = 0;
		}
	}

	pub fn get_rom(&self) -> &[u8; 256] { &self.rom }
}