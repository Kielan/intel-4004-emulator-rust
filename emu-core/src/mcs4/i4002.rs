pub struct I4002 {
	ram: [u8; 64],
	stat: [u8; 16],
	id: bool,

	pub data: u8,
	pub cm: bool,
	pub p0: bool,
	pub sync: bool,
	pub port: u8,

	phase: u8,
	select: bool,
	opa: u8,
	src: u8,
}

impl I4002 {
	pub fn new(id: bool) -> Self {
		I4002 {
			ram: [0; 64],
			stat: [0; 16],
			id: id,

			data: 0,
			cm: false,
			p0: false,
			sync: true,
			port: 0,

			phase: 0,
			select: false,
			opa: 0,
			src: 0,
		}
	}

	pub fn reset(&mut self) {
		self.ram = [0; 64];
		self.stat = [0; 16];
		self.port = 0;
		self.src = 0;
		self.phase = 0;
	}

	pub fn leading_clock(&mut self) {
		self.data = 0;
		if self.phase == 6 {
			if self.opa == 0x8 && self.select {
				self.data = self.ram[self.src as usize & 0x3F];
			} else if self.opa == 0x9 && self.select {
				self.data = self.ram[self.src as usize & 0x3F];
			} else if self.opa == 0xB && self.select {
				self.data = self.ram[self.src as usize & 0x3F];
			} else if self.opa & 0xC == 0xC && self.select {
				let index = self.src >> 2 & 0xC | self.opa & 0x3;
				self.data = self.stat[index as usize];
			}
		}
	}

	pub fn trailing_clock(&mut self) {
		if self.phase == 4 {
			let mask = (self.id as u8) << 7 | (self.p0 as u8) << 6;
			self.select = self.src & 0xC0 == mask && self.cm;
			self.opa = self.data & 0xF;
		} else if self.phase == 6 {
			if self.opa == 0x0 && self.select {
				self.ram[self.src as usize & 0x3F] = self.data & 0xF;
			} else if self.opa == 0x1 && self.select {
				self.port = self.data & 0xF;
			} else if self.opa & 0xC == 0x4 && self.select {
				let index = self.src >> 2 & 0xC | self.opa & 0x3;
				self.stat[index as usize] = self.data & 0xF;
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
		self.phase += 1;
		if self.sync {
			self.phase = 0;
		}
	}

	pub fn get_ram(&self) -> &[u8; 64] { &self.ram }
	pub fn get_stat(&self) -> &[u8; 16] { &self.stat }
}