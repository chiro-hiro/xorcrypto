const crypto = require('crypto');
const assert = require('assert');
const xorCrypto = require('../index.js');

describe('Randomize test', function () {

  for (let i = 1; i < 25; i++)
    it(`Randomize test with ${10240 * i} bytes from randomBytes()`, function () {
      let myCrypto = new xorCrypto(crypto.randomBytes(1024));
      let data = crypto.randomBytes(10240 * i);
      let encrypted = myCrypto.encrypt(data);
      let decrypted = myCrypto.decrypt(encrypted);
      assert.deepEqual(data, decrypted);
    });

  for (let i = 1; i < 25; i++)
    it(`Zero buffer test with ${10240 * i} bytes`, function () {
      let myCrypto = new xorCrypto(crypto.randomBytes(1024));
      let data = Buffer.alloc(10240 * i);
      let encrypted = myCrypto.encrypt(data);
      let decrypted = myCrypto.decrypt(encrypted);
      assert.deepEqual(data, decrypted);
    });

})
