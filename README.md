# xorCrypt

Simple and lightweight algorithm, this encryption use `SHA256` as `PRNG` to create XOR-KEY.

## Features
- XOR-KEY will be change every 32 bytes
- XOR-KEY was created from `SHA256` of `SecrectKey` and `OpenSSL RNG's value`
- Simple
- Lightweight
- Easy to implement
- Data don't repeate by sequence
- Hash based

## Installation
Require NodeJs
```bash
npm install xorcrypt
```
## Usage
```javascript
const xorCrypt = require('xorcrypt');

let xo = new xorCrypt(new Buffer('My secret key, I will share with my friend.'));
let v, e, d;
v = new Buffer('This is my secret message!');

e = xo.encrypt(v);
d = xo.decrypt(e);
console.log(`Value: ${v}\nEncrypted: ${e.toString('hex')}\nDecrypted: ${d.toString()}`);
```
Result:
```bash
chiro@moonfang:~/labs$ node test.js 
Value: This is my secret message!
Encrypted: cc8a630f18837251bd1bbda0c247c443d3cccfe2bfdf598839836f74a0eff248b45fba8b4c445726be3c
Decrypt: This is my secret message!
chiro@moonfang:~/labs$ node test.js 
Value: This is my secret message!
Encrypted: 0bddba0319d71411503cb129d95eaa2006e33f9e5a3fdacce716d3e4b16e79cdeca63c1f3abc589b2af5
Decrypted: This is my secret message!
```
## License
This module distributed under [MIT License](https://github.com/tad88dev/xorcrypt/blob/master/LICENSE)
