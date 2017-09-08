const crypto = require('crypto');
const XOR_KEY_SIZE = 16;

/**
 * Create bigger xor key from static key and random bytes
 * @param {Buffer} key 
 * @param {Buffer} rnd 
 */
function _xorKey(key, rnd) {
    let rawKey = new Buffer(key.length + rnd.length);
    key.copy(rawKey, 0, 0);
    rnd.copy(rawKey, key.length, 0);
    return crypto.createHash('sha256').update(rawKey).digest();
}

/**
 * Xor data with key
 * @param {Buffer} data 
 * @param {Buffer} key 
 */
function _xor(data, key) {
    let otk = crypto.createHash('sha256').update(key).digest();
    let buf = new Buffer(data.length);
    for (let i = 0, c = 0; i < data.length; i++ , c++) {
        if (c == key.length) {
            otk = crypto.createHash('sha256').update(key).update(otk).digest();
            c = 0;
        }
        buf[i] = data[i] ^ otk[c];
    }
    return buf;
}

/**
 * Xor Crypt constructor
 * @param {Buffer} key 
 */
function xorCrypto(key) {
    let _self = this;

    if (typeof (key) === 'undefined') {
        var key = new Buffer('You will not know about me');
    } else if (!Buffer.isBuffer(key)) {
        throw new TypeError("Key have to a Buffer instance");
    }
    this._key = _xorKey(key, new Buffer('48656c6c6f2c49276d20436869726f21', 'hex'));
    this.encrypt = (data) => {
        if (!Buffer.isBuffer(data)) {
            throw new TypeError("Data have to a Buffer instance");
        }
        return this._encrypt(data, _self._key, _self._random());
    }
    this.decrypt = (data) => {
        if (!Buffer.isBuffer(data)) {
            throw new TypeError("Data have to a Buffer instance");
        }
        return this._decrypt(data, _self._key);
    }
}

/**
 * Random bytes from OpenSSL
 */
xorCrypto.prototype._random = () => {
    return crypto.randomBytes(XOR_KEY_SIZE);
}

/**
 * Encrypt method
 */
xorCrypto.prototype._encrypt = (data, key, rnd) => {
    let buf = new Buffer(data.length + rnd.length);
    let encrypted = _xor(data, _xorKey(key, rnd));
    rnd.copy(buf, 0, 0);
    encrypted.copy(buf, rnd.length, 0);
    return buf;
}

/**
 * Decrypt method
 */
xorCrypto.prototype._decrypt = (data, key) => {
    let buf = new Buffer(data.length - XOR_KEY_SIZE);
    let rnd = new Buffer(XOR_KEY_SIZE);
    data.copy(rnd, 0, 0, rnd.length);
    data.copy(buf, 0, rnd.length);
    return _xor(buf, _xorKey(key, rnd));
}

module.exports = xorCrypto;