
let wasm;

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

function notDefined(what) { return () => { throw new Error(`${what} is not defined`); }; }

let cachegetInt32Memory0 = null;
function getInt32Memory0() {
    if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
        cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachegetInt32Memory0;
}

function getArrayU8FromWasm0(ptr, len) {
    return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
}

let cachegetUint16Memory0 = null;
function getUint16Memory0() {
    if (cachegetUint16Memory0 === null || cachegetUint16Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint16Memory0 = new Uint16Array(wasm.memory.buffer);
    }
    return cachegetUint16Memory0;
}

function getArrayU16FromWasm0(ptr, len) {
    return getUint16Memory0().subarray(ptr / 2, ptr / 2 + len);
}
/**
*/
export class Js4002 {

    static __wrap(ptr) {
        const obj = Object.create(Js4002.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_js4002_free(ptr);
    }
    /**
    * @returns {Uint8Array}
    */
    get_ram() {
        wasm.js4002_get_ram(8, this.ptr);
        var r0 = getInt32Memory0()[8 / 4 + 0];
        var r1 = getInt32Memory0()[8 / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
    }
    /**
    * @returns {Uint8Array}
    */
    get_stat() {
        wasm.js4002_get_stat(8, this.ptr);
        var r0 = getInt32Memory0()[8 / 4 + 0];
        var r1 = getInt32Memory0()[8 / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
    }
}
/**
*/
export class Js4004 {

    static __wrap(ptr) {
        const obj = Object.create(Js4004.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_js4004_free(ptr);
    }
    /**
    * @returns {number}
    */
    get acc() {
        var ret = wasm.__wbg_get_js4004_acc(this.ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set acc(arg0) {
        wasm.__wbg_set_js4004_acc(this.ptr, arg0);
    }
    /**
    * @returns {boolean}
    */
    get carry() {
        var ret = wasm.__wbg_get_js4004_carry(this.ptr);
        return ret !== 0;
    }
    /**
    * @param {boolean} arg0
    */
    set carry(arg0) {
        wasm.__wbg_set_js4004_carry(this.ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get sptr() {
        var ret = wasm.__wbg_get_js4004_sptr(this.ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set sptr(arg0) {
        wasm.__wbg_set_js4004_sptr(this.ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get data() {
        var ret = wasm.__wbg_get_js4004_data(this.ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set data(arg0) {
        wasm.__wbg_set_js4004_data(this.ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get instr() {
        var ret = wasm.__wbg_get_js4004_instr(this.ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set instr(arg0) {
        wasm.__wbg_set_js4004_instr(this.ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get arg() {
        var ret = wasm.__wbg_get_js4004_arg(this.ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set arg(arg0) {
        wasm.__wbg_set_js4004_arg(this.ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get phase() {
        var ret = wasm.__wbg_get_js4004_phase(this.ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set phase(arg0) {
        wasm.__wbg_set_js4004_phase(this.ptr, arg0);
    }
    /**
    * @returns {Uint8Array}
    */
    get_reg() {
        wasm.js4002_get_ram(8, this.ptr);
        var r0 = getInt32Memory0()[8 / 4 + 0];
        var r1 = getInt32Memory0()[8 / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
    }
    /**
    * @returns {Uint16Array}
    */
    get_stack() {
        wasm.js4004_get_stack(8, this.ptr);
        var r0 = getInt32Memory0()[8 / 4 + 0];
        var r1 = getInt32Memory0()[8 / 4 + 1];
        var v0 = getArrayU16FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 2);
        return v0;
    }
}
/**
*/
export class JsBusicom141PF {

    static __wrap(ptr) {
        const obj = Object.create(JsBusicom141PF.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_jsbusicom141pf_free(ptr);
    }
    /**
    * @returns {boolean}
    */
    get paper_feed() {
        var ret = wasm.__wbg_get_jsbusicom141pf_paper_feed(this.ptr);
        return ret !== 0;
    }
    /**
    * @param {boolean} arg0
    */
    set paper_feed(arg0) {
        wasm.__wbg_set_jsbusicom141pf_paper_feed(this.ptr, arg0);
    }
    /**
    * @returns {boolean}
    */
    get lamp_mem() {
        var ret = wasm.__wbg_get_jsbusicom141pf_lamp_mem(this.ptr);
        return ret !== 0;
    }
    /**
    * @param {boolean} arg0
    */
    set lamp_mem(arg0) {
        wasm.__wbg_set_jsbusicom141pf_lamp_mem(this.ptr, arg0);
    }
    /**
    * @returns {boolean}
    */
    get lamp_ovf() {
        var ret = wasm.__wbg_get_jsbusicom141pf_lamp_ovf(this.ptr);
        return ret !== 0;
    }
    /**
    * @param {boolean} arg0
    */
    set lamp_ovf(arg0) {
        wasm.__wbg_set_jsbusicom141pf_lamp_ovf(this.ptr, arg0);
    }
    /**
    * @returns {boolean}
    */
    get lamp_sig() {
        var ret = wasm.__wbg_get_jsbusicom141pf_lamp_sig(this.ptr);
        return ret !== 0;
    }
    /**
    * @param {boolean} arg0
    */
    set lamp_sig(arg0) {
        wasm.__wbg_set_jsbusicom141pf_lamp_sig(this.ptr, arg0);
    }
    /**
    */
    constructor() {
        var ret = wasm.jsbusicom141pf_new();
        return JsBusicom141PF.__wrap(ret);
    }
    /**
    */
    reset() {
        wasm.jsbusicom141pf_reset(this.ptr);
    }
    /**
    * @param {number} delta
    */
    update(delta) {
        wasm.jsbusicom141pf_update(this.ptr, delta);
    }
    /**
    * @param {number} c
    * @param {number} r
    * @param {boolean} v
    */
    key_matrix(c, r, v) {
        wasm.jsbusicom141pf_key_matrix(this.ptr, c, r, v);
    }
    /**
    * @param {number} v
    */
    digit_point(v) {
        wasm.jsbusicom141pf_digit_point(this.ptr, v);
    }
    /**
    * @param {number} v
    */
    rounding(v) {
        wasm.jsbusicom141pf_rounding(this.ptr, v);
    }
    /**
    * @param {number} i
    * @returns {Js4002}
    */
    get_ram(i) {
        var ret = wasm.jsbusicom141pf_get_ram(this.ptr, i);
        return Js4002.__wrap(ret);
    }
    /**
    * @param {number} i
    * @returns {Js4004}
    */
    get_cpu(i) {
        var ret = wasm.jsbusicom141pf_get_cpu(this.ptr, i);
        return Js4004.__wrap(ret);
    }
}
/**
*/
export class MCS4EvalKit {

    static __wrap(ptr) {
        const obj = Object.create(MCS4EvalKit.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_mcs4evalkit_free(ptr);
    }
    /**
    * @returns {number}
    */
    get p0() {
        var ret = wasm.__wbg_get_mcs4evalkit_p0(this.ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set p0(arg0) {
        wasm.__wbg_set_mcs4evalkit_p0(this.ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get p1() {
        var ret = wasm.__wbg_get_mcs4evalkit_p1(this.ptr);
        return ret;
    }
    /**
    * @param {number} arg0
    */
    set p1(arg0) {
        wasm.__wbg_set_mcs4evalkit_p1(this.ptr, arg0);
    }
    /**
    */
    constructor() {
        var ret = wasm.mcs4evalkit_new();
        return MCS4EvalKit.__wrap(ret);
    }
    /**
    */
    clock() {
        wasm.mcs4evalkit_clock(this.ptr);
    }
}

function init(module) {
    if (typeof module === 'undefined') {
        module = import.meta.url.replace(/\.js$/, '_bg.wasm');
    }
    let result;
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbg_cbfire_699ef15998efbb22 = function(arg0, arg1, arg2) {
        cb_fire(arg0, arg1, arg2 !== 0);
    };
    imports.wbg.__wbg_cbadvance_4322da381a60dc32 = typeof cb_advance == 'function' ? cb_advance : notDefined('cb_advance');
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };

    if ((typeof URL === 'function' && module instanceof URL) || typeof module === 'string' || (typeof Request === 'function' && module instanceof Request)) {

        const response = fetch(module);
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            result = WebAssembly.instantiateStreaming(response, imports)
            .catch(e => {
                return response
                .then(r => {
                    if (r.headers.get('Content-Type') != 'application/wasm') {
                        console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);
                        return r.arrayBuffer();
                    } else {
                        throw e;
                    }
                })
                .then(bytes => WebAssembly.instantiate(bytes, imports));
            });
        } else {
            result = response
            .then(r => r.arrayBuffer())
            .then(bytes => WebAssembly.instantiate(bytes, imports));
        }
    } else {

        result = WebAssembly.instantiate(module, imports)
        .then(result => {
            if (result instanceof WebAssembly.Instance) {
                return { instance: result, module };
            } else {
                return result;
            }
        });
    }
    return result.then(({instance, module}) => {
        wasm = instance.exports;
        init.__wbindgen_wasm_module = module;

        return wasm;
    });
}

export default init;

