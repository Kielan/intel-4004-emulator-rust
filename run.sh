#!/usr/bin/env sh
rustup run stable wasm-pack build --target web || exit 1
cp pkg/emu.js pkg/emu_bg.wasm pub || exit 1
PORT=8080 npm run start || exit 1