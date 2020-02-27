pub struct I4003 {
	data: u16,
	last_clock: bool,

	pub input: bool,
	pub serial: bool,
	pub output: u16,
	pub enable: bool,
	pub clock: bool,
}

impl I4003 {
	pub fn new() -> Self {
		I4003 {
			data: 0,
			last_clock: false,
		
			input: false,
			serial: false,
			output: 0,
			enable: false,
			clock: false,
		}
	}

	pub fn update(&mut self) {
		if self.clock && !self.last_clock {
			self.serial = self.data & 0x200 != 0;
			self.data = (self.data << 1 | self.input as u16) & 0x3FF;
		}
		self.last_clock = self.clock;
		if self.enable {
			self.output = self.data;
		} else {
			self.output = 0;
		}
	}

	pub fn get_data(&self) -> u16 { self.data }
}