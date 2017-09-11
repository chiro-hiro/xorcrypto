'use strict';
const crypto = require('crypto');

const XOR_KEY_SIZE = 16;

/**
 * Random bytes from OpenSSL
 */
function _random() {
    return crypto.randomBytes(XOR_KEY_SIZE);
}

/**
 * Sha256 from params
 */
function _sha256() {
    let sha = crypto.createHash('sha256');
    for (let i = 0; i < arguments.length; i++) {
        sha.update(arguments[i]);
    }
    return sha.digest();
}

/**
 * Data check
 * @param {Buffer} data 
 */
function _onlyBuffer(data) {
    if (typeof (data) !== 'undefined' && Buffer.isBuffer(data)) {
        return data;
    }
    throw new TypeError('Only Buffer will be accepted');
}

/**
 * Create bigger xor key from static key and random bytes
 * @param {Buffer} key 
 * @param {Buffer} rnd 
 */
function _xorKey(key, rnd) {
    let rawKey = new Buffer(key.length + rnd.length);
    key.copy(rawKey, 0, 0);
    rnd.copy(rawKey, key.length, 0);
    return _sha256(rawKey);
}

/**
 * Xor data with key
 * @param {Buffer} data 
 * @param {Buffer} key 
 */
function _xor(data, key) {
    let buf = new Buffer(data.length);
    let otk = _sha256(key); //One time key
    for (let i = 0, c = 0; i < data.length; i++ , c++) {
        if (c == key.length) {
            otk = _sha256(key, otk); //Change the key
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

    this._init(key);

    //Provide ecnrypt method
    this.encrypt = (data) => {
        return this._encrypt(_onlyBuffer(data), _random());
    }

    //Provide decrypt method
    this.decrypt = (data) => {
        return this._decrypt(_onlyBuffer(data));
    }
}



/**
 * Init function
 */
xorCrypto.prototype._init = (key) => {
    if (typeof (key) === 'undefined') {
        var key = new Buffer('You will not know about me');
    }
    this._key = _xorKey(_onlyBuffer(key), new Buffer('48656c6c6f2c49276d20436869726f21', 'hex'));
}

/**
 * Encrypt method
 */
xorCrypto.prototype._encrypt = (data, rnd) => {
    let buf = new Buffer(data.length + rnd.length);
    let encrypted = _xor(data, _xorKey(this._key, rnd));
    rnd.copy(buf, 0, 0);
    encrypted.copy(buf, rnd.length, 0);
    return buf;
}

/**
 * Decrypt method
 */
xorCrypto.prototype._decrypt = (data) => {
    let buf = new Buffer(data.length - XOR_KEY_SIZE);
    let rnd = new Buffer(XOR_KEY_SIZE);
    data.copy(rnd, 0, 0, rnd.length);
    data.copy(buf, 0, rnd.length);
    return _xor(buf, _xorKey(this._key, rnd));
}

/**
 * Export module
 */
module.exports = xorCrypto;