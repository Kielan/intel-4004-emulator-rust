use emu_core::*;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern {
	fn cb_fire(_: u8, _: u8, _: bool);
	fn cb_advance();
}

#[wasm_bindgen]
pub struct Js4002 {
	ram: Box<[u8]>,
	stat: Box<[u8]>,
}

#[wasm_bindgen]
impl Js4002 {
	pub fn get_ram(&self) -> Box<[u8]> { self.ram.clone() }
	pub fn get_stat(&self) -> Box<[u8]> { self.stat.clone() }
}

#[wasm_bindgen]
pub struct Js4004 {
	pub acc: u8,
	pub carry: bool,
	reg: Box<[u8]>,
	stack: Box<[u16]>,
	pub sptr: u8,
	pub data: u8,
	pub instr: u8,
	pub arg: u8,
	pub phase: u8,
}

#[wasm_bindgen]
impl Js4004 {
	pub fn get_reg(&self) -> Box<[u8]> { self.reg.clone() }
	pub fn get_stack(&self) -> Box<[u16]> { self.stack.clone() }
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
		result.update(0.00000135 / 2.0);
		result
	}

	pub fn reset(&mut self) {
		self.device.reset();
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

	pub fn get_ram(&self, i: usize) -> Js4002 {
		return Js4002 {
			ram: Box::new(*self.device.get_ram(i).get_ram()),
			stat: Box::new(*self.device.get_ram(i).get_stat()),
		}
	}

	pub fn get_cpu(&self, i: usize) -> Js4004 {
		return Js4004 {
			acc: self.device.get_cpu(i).get_acc(),
			carry: self.device.get_cpu(i).get_carry(),
			reg: Box::new(*self.device.get_cpu(i).get_reg()),
			stack: Box::new(*self.device.get_cpu(i).get_stack()),
			sptr: self.device.get_cpu(i).get_ptr(),
			data: self.device.get_cpu(i).data,
			instr: self.device.get_cpu(i).get_instr(),
			arg: self.device.get_cpu(i).get_arg(),
			phase: self.device.get_cpu(i).get_phase(),
		}
	}
}