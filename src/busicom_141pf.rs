use emu_core::*;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern {
	fn cb_fire(_: u8, _: u8, _: bool);
	fn cb_advance();
}

#[wasm_bindgen]
pub struct JsBusicom141PF {
	pub paper_feed: bool,
	pub lamp_mem: bool,
	pub lamp_ovf: bool,
	pub lamp_sig: bool,
	device: Busicom141PF,
}

#[wasm_bindgen]
impl JsBusicom141PF {
	#[wasm_bindgen(constructor)]
	pub fn new() -> Self {
		let mut result = JsBusicom141PF {
			paper_feed: false,
			lamp_mem: false,
			lamp_ovf: false,
			lamp_sig: false,
			device: Busicom141PF::new(),
		};
		result.device.cb_fire = cb_fire;
		result.device.cb_advance = cb_advance;
		result
	}

	pub fn update(&mut self, delta: f64) {
		self.device.paper_feed = self.paper_feed;
		self.device.update(delta);
		self.lamp_mem = self.device.lamp_mem;
		self.lamp_ovf = self.device.lamp_ovf;
		self.lamp_sig = self.device.lamp_sig;
	}

	pub fn key_matrix(&mut self, c: usize, r: u8, v: bool) {
		if v {
			self.device.key_matrix[c] |= 1 << r;
		} else {
			self.device.key_matrix[c] &= (1 << r) ^ 0xF;
		}
	}

	pub fn digit_point(&mut self, v: u8) {
		self.device.key_matrix[8] = v;
	}

	pub fn rounding(&mut self, v: u8) {
		self.device.key_matrix[9] = v;
	}
}