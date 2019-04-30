import { sha256 } from 'js-sha256'
import randomBytes from 'randombytes'
import { Buffer } from 'safe-buffer'

class utilities {

  static random(size: number = 0): Buffer {
    return Buffer.from(randomBytes(size))
  }

  static sha256(...params: any): string {
    let hash = sha256.create()
    for (let i = 0; i < params.length; i++) {
      hash.update(params[i])
    }
    return hash.hex()
  }

  static xor(a: Buffer, b: Buffer): Buffer {
    if (a.length !== b.length) {
      throw Error('Xor size is different')
    }
    if (a.length % 4 !== 0) {
      throw Error('Invalid size of data')
    }
    let c = Buffer.allocUnsafe(a.length)
    for (let i = 0; i < a.length; i += 4) {
      c.writeUInt32BE((a.readUInt32BE(i) ^ b.readUInt32BE(i)) >>> 0, i)
    }
    return c
  }

}

export default utilities;