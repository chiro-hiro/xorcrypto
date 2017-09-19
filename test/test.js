const crypto = require('crypto');
const assert = require('assert');
const xorCrypto = require('../index.js');

describe('Randomize test', function () {
    it('Randomize test with 10240 bytes from randomBytes()', function () {
        let myCrypto = new xorCrypto(crypto.randomBytes(1024));
        for (let i = 0; i < 10; i++) {
            let data = crypto.randomBytes(10240);
            let encrypted = myCrypto.encrypt(data);
            let decrypted = myCrypto.decrypt(encrypted);
            assert.deepEqual(data, decrypted);
        }
    });
})

describe('Test null bytes key', function (t) {
    it('Test empty key', function () {
        let myCrypto = new xorCrypto(Buffer.alloc(1024));
        let data = crypto.randomBytes(1024);
        let encrypted = myCrypto.encrypt(data);

        assert.equal(typeof (myCrypto), 'object');
        assert.deepEqual(data, myCrypto.decrypt(encrypted));
    });
    it('Test empty key', function () {
        let myCrypto = new xorCrypto();
        let data = crypto.randomBytes(1024);
        let encrypted = myCrypto.encrypt(data);
        assert.equal(typeof (myCrypto), 'object');
        assert.deepEqual(data, myCrypto.decrypt(encrypted));
    });

})

describe('Decrypt without encrypt', function (t) {
    it('Descrypt from random bytes', function () {
        let myCrypto = new xorCrypto(crypto.randomBytes(1024));
        let data = crypto.randomBytes(1024);
        let decrypted = myCrypto.decrypt(data);

        assert.equal(data.length - decrypted.length, 16);
        assert.deepEqual(myCrypto.decrypt(data), decrypted);
    });
})
