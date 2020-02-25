pub struct I4004 {
	acc: u8,
	carry: bool,
	reg: [u8; 16],
	stack: [u16; 4],
	ptr: u8,

	pub data: u8,
	pub test: bool,
	pub ram: u8,
	pub rom: bool,
	pub sync: bool,

	phase: u8,
	instr: u8,
	arg: u8,
	cmd: u8,
	cycle: bool,
}

impl I4004 {
	pub fn new() -> Self {
		I4004 {
			acc: 0,
			carry: false,
			reg: [0; 16],
			stack: [0; 4],
			ptr: 0,

			data: 0,
			test: false,
			ram: 0,
			rom: false,
			sync: true,

			phase: 0,
			instr: 0,
			arg: 0,
			cmd: 0,
			cycle: false,
		}
	}

	pub fn reset(&mut self) {
		self.acc = 0;
		self.carry = false;
		self.reg = [0; 16];
		self.stack = [0; 4];
		self.ptr = 0;
		self.phase = 0;
		self.cmd = 0;
		self.cycle = false;
	}

	pub fn leading_clock(&mut self) {
		self.data = 0;
		self.ram = 0;
		self.rom = false;
		self.sync = false;
		if self.phase == 0 {
			if self.cycle && self.instr & 0xF1 == 0x30 {
				self.data = self.reg[1];
			} else {
				self.data = (*self.pc() >> 0 & 0xF) as u8;
			}
		} else if self.phase == 1 {
			if self.cycle && self.instr & 0xF1 == 0x30 {
				self.data = self.reg[0];
			} else {
				self.data = (*self.pc() >> 4 & 0xF) as u8;
			}
		} else if self.phase == 2 {
			self.data = (*self.pc() >> 8 & 0xF) as u8;
			if !(self.cycle && self.instr & 0xF1 == 0x30) {
				*self.pc() = (*self.pc() + 1) & 0xFFF;
			}
			self.set_cm();
		} else if self.phase == 4 {
			if !self.cycle && self.arg & 0xF0 == 0xE0 {
				self.set_cm();
			}
		} else if self.phase == 6 {
			if self.instr & 0xF1 == 0x21 {
				self.set_cm();
				self.data = self.reg[self.instr as usize & 0x0E | 0];
			} else if self.instr & 0xF8 == 0xE0 {
				self.data = self.acc;
			}
		} else if self.phase == 7 {
			if self.instr & 0xF1 == 0x21 {
				self.data = self.reg[self.instr as usize & 0x0E | 1];
			}
			self.sync = true;
		}
	}

	pub fn trailing_clock(&mut self) {
		if self.phase == 3 {
			self.arg = self.arg & 0x0F | self.data << 4 & 0xF0;
		} else if self.phase == 4 {
			self.arg = self.arg & 0xF0 | self.data << 0 & 0x0F;
			if !self.cycle {
				self.instr = self.arg;
			}
		} else if self.phase == 5 {
			self.instr_acc();
			self.cycle = self.instr_machine();
		} else if self.phase == 6 {
			if self.instr == 0xE8 {
				let data = self.data & 0xF;
				let result = self.acc + (data ^ 0xF) + !self.carry as u8;
				self.acc_set(result);
			} else if self.instr == 0xEB {
				let data = self.data & 0xF;
				let result = self.acc + data + self.carry as u8;
				self.acc_set(result);
			} else if self.instr & 0xF8 == 0xE8 {
				self.acc = self.data & 0xF;
			}
		}
		self.phase = (self.phase + 1) % 8;
	}

	fn pc(&mut self) -> &mut u16 {
		&mut self.stack[self.ptr as usize]
	}

	fn set_cm(&mut self) {
		let table = [
			0b0001, 0b0010, 0b0100, 0b0110,
			0b1000, 0b1010, 0b1100, 0b1110,
		];
		self.rom = true;
		self.ram = table[self.cmd as usize];
	}

	fn acc_set(&mut self, val: u8) {
		self.acc = val & 0xF;
		self.carry = val > 0xF; 
	}

	fn instr_acc(&mut self) {
		if self.instr == 0xF0 { // CLB
			self.acc_set(0);
		} else if self.instr == 0xF1 { // CLC
			self.carry = false;
		} else if self.instr == 0xF2 { // IAC
			let result = self.acc + 1;
			self.acc_set(result);
		} else if self.instr == 0xF3 { // CMC
			self.carry = !self.carry;
		} else if self.instr == 0xF4 { // CMA
			self.acc = self.acc ^ 0xF;
		} else if self.instr == 0xF5 { // RAL
			let result = self.acc.rotate_left(1) | self.carry as u8;
			self.acc_set(result);
		} else if self.instr == 0xF6 { // RAR
			let result = self.acc.rotate_right(1) | (self.carry as u8) << 3;
			self.acc_set(result);
		} else if self.instr == 0xF7 { // TCC
			self.acc = self.carry as u8;
			self.carry = false;
		} else if self.instr == 0xF8 { // DAC
			let result = self.acc + 15;
			self.acc_set(result);
		} else if self.instr == 0xF9 { // TCS
			self.acc = 9 + self.carry as u8;
			self.carry = false;
		} else if self.instr == 0xFA { // STC
			self.carry = true;
		} else if self.instr == 0xFB { // DAA
			self.carry = self.carry || self.acc > 9;
			self.acc = (self.acc + self.carry as u8 * 6) & 0xF;
		} else if self.instr == 0xFC { // KBP
			let table = [
				0x0, 0x1, 0x2, 0xF, 0x3, 0xF, 0xF, 0xF,
				0x4, 0xF, 0xF, 0xF, 0xF, 0xF, 0xF, 0xF,
			];
			self.acc = table[self.acc as usize];
		} else if self.instr == 0xFD { // DCL
			self.cmd = self.acc & 0x7;
		}
	}

	fn instr_machine(&mut self) -> bool {
		if self.instr & 0xF0 == 0x10 { // JCN
			if !self.cycle { return true; }
			let binv = self.instr & 0x08 != 0;
			let bacc = self.instr & 0x04 != 0 && self.acc == 0;
			let bcar = self.instr & 0x02 != 0 && self.carry;
			let bsig = self.instr & 0x01 != 0 && !self.test;
			if binv != (bacc || bcar || bsig) {
				*self.pc() = *self.pc() & 0xF00 | self.arg as u16;
			}
		} else if self.instr & 0xF1 == 0x20 { // FIM
			if !self.cycle { return true; }
			self.reg[self.instr as usize & 0x0E | 0] = self.arg >> 4 & 0xF;
			self.reg[self.instr as usize & 0x0E | 1] = self.arg >> 0 & 0xF;
		} else if self.instr & 0xF1 == 0x30 { // FIN
			if !self.cycle { return true; }
			self.reg[self.instr as usize & 0x0E | 0] = self.arg >> 4 & 0xF;
			self.reg[self.instr as usize & 0x0E | 1] = self.arg >> 0 & 0xF;
		} else if self.instr & 0xF1 == 0x31 { // JIN
			let r0 = self.reg[self.instr as usize & 0x0E | 0] as u16;
			let r1 = self.reg[self.instr as usize & 0x0E | 1] as u16;
			*self.pc() = *self.pc() & 0xF00 | r0 << 4 | r1;
		} else if self.instr & 0xF0 == 0x40 { // JUN
			if !self.cycle { return true; }
			*self.pc() = (self.instr as u16 & 0x0F) << 8 | self.arg as u16;
		} else if self.instr & 0xF0 == 0x50 { // JMS
			if !self.cycle { return true; }
			self.ptr = (self.ptr + 1) % 4;
			*self.pc() = (self.instr as u16 & 0x0F) << 8 | self.arg as u16;
		} else if self.instr & 0xF0 == 0x60 { // INC
			let reg = &mut self.reg[self.instr as usize & 0x0F];
			*reg = (*reg + 1) & 0xF;
		} else if self.instr & 0xF0 == 0x70 { // ISZ
			if !self.cycle { return true; }
			{
				let reg = &mut self.reg[self.instr as usize & 0x0F];
				*reg = (*reg + 1) & 0xF;
			}
			if self.reg[self.instr as usize & 0x0F] != 0 {
				*self.pc() = *self.pc() & 0xF00 | self.arg as u16;
			}
		} else if self.instr & 0xF0 == 0x80 { // ADD
			let reg = self.reg[self.instr as usize & 0x0F];
			let result = self.acc + reg + self.carry as u8;
			self.acc_set(result);
		} else if self.instr & 0xF0 == 0x90 { // SUB
			let reg = self.reg[self.instr as usize & 0x0F];
			let result = self.acc + (reg ^ 0xF) + !self.carry as u8;
			self.acc_set(result);
		} else if self.instr & 0xF0 == 0xA0 { // LD
			self.acc = self.reg[self.instr as usize & 0x0F];
		} else if self.instr & 0xF0 == 0xB0 { // XCH
			let reg = self.reg[self.instr as usize & 0x0F];
			self.reg[self.instr as usize & 0x0F] = self.acc;
			self.acc = reg;
		} else if self.instr & 0xF0 == 0xC0 { // BBL
			self.acc = self.instr & 0x0F;
			self.ptr = (self.ptr + 3) % 4;
		} else if self.instr & 0xF0 == 0xD0 { // LDM
			self.acc = self.instr & 0x0F;
		}
		return false;
	}
}

use std::fmt;
impl fmt::Debug for I4004 {
	fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
		write!(f, "{:3}", self.stack[self.ptr as usize] % 256)
	}
}