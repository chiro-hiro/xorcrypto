"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var safe_buffer_1 = require("safe-buffer");
var utilities_1 = __importDefault(require("./utilities"));
var crypto_1 = require("crypto");
var STREAM_SIZE = 32;
var PADDING_SIZE = 1;
var xorCrypto = (function () {
    function xorCrypto(secret) {
        this._secretKey = safe_buffer_1.Buffer.from(utilities_1.default.sha256(secret), 'hex');
    }
    xorCrypto.prototype._randomKey = function () {
        return safe_buffer_1.Buffer.from(crypto_1.randomBytes(STREAM_SIZE));
    };
    xorCrypto.prototype._childKey = function () {
        return safe_buffer_1.Buffer.from(utilities_1.default.sha256(safe_buffer_1.Buffer.concat([this._secretKey, this._randomKey()])), 'hex');
    };
    xorCrypto.prototype._nextChildKey = function (childKey) {
        return safe_buffer_1.Buffer.from(utilities_1.default.sha256(safe_buffer_1.Buffer.concat([this._secretKey, childKey])), 'hex');
    };
    xorCrypto.prototype._encryptedChildKey = function (childKey) {
        return utilities_1.default.xor(childKey, this._secretKey);
    };
    xorCrypto.prototype._paddingSize = function (data) {
        return STREAM_SIZE - (data.length % STREAM_SIZE);
    };
    xorCrypto.prototype._padding = function (data) {
        var paddingSize = this._paddingSize(data);
        if (paddingSize === 0) {
            return data;
        }
        else {
            return safe_buffer_1.Buffer.concat([data, safe_buffer_1.Buffer.alloc(paddingSize)]);
        }
    };
    xorCrypto.prototype.encrypt = function (data) {
        if (!safe_buffer_1.Buffer.isBuffer(data)) {
            data = safe_buffer_1.Buffer.from(data);
        }
        var metaDataSize = PADDING_SIZE + STREAM_SIZE;
        var paddingSize = this._paddingSize(data);
        var paddedData = this._padding(data);
        var childKey = this._childKey();
        var encryptedChildKey = this._encryptedChildKey(childKey);
        var encryptedData = safe_buffer_1.Buffer.alloc(metaDataSize + paddedData.length);
        encryptedData.writeUInt8(paddingSize, 0);
        encryptedChildKey.copy(encryptedData, PADDING_SIZE);
        for (var i = 0, c = 0; i < paddedData.length; i += 4, c += 4) {
            if (c === STREAM_SIZE) {
                childKey = this._nextChildKey(childKey);
                c = 0;
            }
            encryptedData.writeUInt32BE((paddedData.readUInt32BE(i) ^ childKey.readUInt32BE(c)) >>> 0, i + metaDataSize);
        }
        return encryptedData;
    };
    xorCrypto.prototype.decrypt = function (encryptedData) {
        var metaDataSize = PADDING_SIZE + STREAM_SIZE;
        var encryptedChildKey = safe_buffer_1.Buffer.alloc(STREAM_SIZE);
        var paddingSize = encryptedData.readUInt8(0);
        encryptedData.copy(encryptedChildKey, 0, PADDING_SIZE, STREAM_SIZE + 1);
        var childKey = this._encryptedChildKey(encryptedChildKey);
        var decryptedData = safe_buffer_1.Buffer.allocUnsafe(encryptedData.length - metaDataSize);
        for (var i = 0, c = 0; i < decryptedData.length; i += 4, c += 4) {
            if (c === STREAM_SIZE) {
                childKey = this._nextChildKey(childKey);
                c = 0;
            }
            decryptedData.writeUInt32BE((encryptedData.readUInt32BE(i + metaDataSize) ^ childKey.readUInt32BE(c)) >>> 0, i);
        }
        return decryptedData.slice(0, decryptedData.length - paddingSize);
    };
    return xorCrypto;
}());
exports.xorCrypto = xorCrypto;
//# sourceMappingURL=xorcrypto.js.map