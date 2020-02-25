
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

