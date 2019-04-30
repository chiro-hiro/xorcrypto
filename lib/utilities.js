"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var js_sha256_1 = require("js-sha256");
var randombytes_1 = __importDefault(require("randombytes"));
var safe_buffer_1 = require("safe-buffer");
var utilities = (function () {
    function utilities() {
    }
    utilities.random = function (size) {
        if (size === void 0) { size = 0; }
        return safe_buffer_1.Buffer.from(randombytes_1.default(size));
    };
    utilities.sha256 = function () {
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i] = arguments[_i];
        }
        var hash = js_sha256_1.sha256.create();
        for (var i = 0; i < params.length; i++) {
            hash.update(params[i]);
        }
        return hash.hex();
    };
    utilities.xor = function (a, b) {
        if (a.length !== b.length) {
            throw Error('Xor size is different');
        }
        if (a.length % 4 !== 0) {
            throw Error('Invalid size of data');
        }
        var c = safe_buffer_1.Buffer.allocUnsafe(a.length);
        for (var i = 0; i < a.length; i += 4) {
            c.writeUInt32BE((a.readUInt32BE(i) ^ b.readUInt32BE(i)) >>> 0, i);
        }
        return c;
    };
    return utilities;
}());
exports.default = utilities;
//# sourceMappingURL=utilities.js.map