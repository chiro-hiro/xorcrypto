# xorCrypto
[![npm version](https://travis-ci.org/tad88dev/xorcrypto.svg?branch=master)](https://travis-ci.org/tad88dev/xorcrypto.svg?branch=master)
[![npm version](https://badge.fury.io/js/xorcrypto.svg)](https://badge.fury.io/js/xorcrypto)

Simple and lightweight algorithm, this encryption used `SHA256` as `PRNG` to create `XOR-KEY`.

## Features
- `XOR-KEY` will be changed every 32 bytes
- `XOR-KEY` was created from `SHA256` of `SecrectKey` and `OpenSSL RNG's value`
- Simple
- Lightweight
- Easy to implement
- Data don't repeate by sequence
- Hash based

## Installation
Require NodeJs
```bash
npm install xorcrypto
```
## Usage
```javascript
const xorCrypto = require('xorcrypto');

let myXorCrypto = new xorCrypto(Buffer.from('My secret key, I will share with my friend.'));
let value, encrypted, decrypted;
value = Buffer.from('This is my secret message!');

encrypted = myXorCrypto.encrypt(value);

decrypted = myXorCrypto.decrypt(encrypted);

console.log(`Value: ${value}\nEncrypted: ${encrypted.toString('hex')}\nDecrypted: ${decrypted.toString()}\nIs the same: ${decrypted.toString() == value}`);
```
Result:
```bash
chiro@moonfang:~/labs$ node test.js 
Value: This is my secret message!
Encrypted: 970504f07e0ee97aa3e53c55414fc6f01b581e0d441167c64c8a8f807bc5617f59c190bc555c96eaf504
Decrypted: This is my secret message!
Is the same: true
chiro@moonfang:~/labs$ node test.js 
Value: This is my secret message!
Encrypted: 79f0a536a36e1a284ec450acc14651c00b9c043462158d2177dccda7d821bc35c8335fa68f610d01c0f9
Decrypted: This is my secret message!
Is the same: true
chiro@moonfang:~/labs$ 
```
## License
This module distributed under [MIT License](https://github.com/tad88dev/xorcrypto/blob/master/LICENSE)
