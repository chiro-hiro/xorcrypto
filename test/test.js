const test = require('tape');
const crypto = require('crypto');
const xorCrypto = require('../index.js');

test('Randomize test', function (t) {
    let myCrypto = new xorCrypto(crypto.randomBytes(1024));
    for (let i = 0; i < 10; i++) {
        let data = crypto.randomBytes(10240);
        let encrypted = myCrypto.encrypt(data);
        let decrypted = myCrypto.decrypt(encrypted);
        t.deepEqual(data, decrypted);
    }
    t.end();
})

test('Test null key', function (t) {
    let myCrypto = new xorCrypto(Buffer.alloc(1024));
    let data = crypto.randomBytes(1024);
    let encrypted = myCrypto.encrypt(data);

    t.equal(typeof (myCrypto), 'object');
    t.deepEqual(data, myCrypto.decrypt(encrypted));
    t.end();
})

test('Decrypt without encrypt', function (t) {
    let myCrypto = new xorCrypto(crypto.randomBytes(1024));
    let data = crypto.randomBytes(1024);
    let decrypted = myCrypto.decrypt(data);

    t.equal(data.length - decrypted.length, 16);
    t.deepEqual(myCrypto.decrypt(data), decrypted);
    t.end();
})
