import { Buffer } from 'safe-buffer'
import utilities from './utilities'
import { randomBytes } from 'crypto';

const STREAM_SIZE = 32
const PADDING_SIZE = 1

export class xorCrypto {

  private _secretKey: Buffer

  constructor(secret: string) {
    this._secretKey = Buffer.from(utilities.sha256(secret), 'hex')
  }

  private _randomKey() {
    return Buffer.from(randomBytes(STREAM_SIZE))
  }

  private _childKey(): Buffer {
    return Buffer.from(utilities.sha256(Buffer.concat([this._secretKey, this._randomKey()])), 'hex')
  }

  private _nextChildKey(childKey: Buffer): Buffer {
    return Buffer.from(utilities.sha256(Buffer.concat([this._secretKey, childKey])), 'hex')
  }

  private _encryptedChildKey(childKey: Buffer): Buffer {
    return utilities.xor(childKey, this._secretKey)
  }

  private _paddingSize(data: Buffer): number {
    return STREAM_SIZE - (data.length % STREAM_SIZE)
  }

  private _padding(data: Buffer) {
    let paddingSize = this._paddingSize(data)
    if (paddingSize === 0) {
      return data
    } else {
      return Buffer.concat([data, Buffer.alloc(paddingSize)])
    }
  }

  encrypt(data: Buffer | string): Buffer {
    if (!Buffer.isBuffer(data)) {
      data = Buffer.from(data)
    }
    let metaDataSize = PADDING_SIZE + STREAM_SIZE;
    let paddingSize = this._paddingSize(data)
    let paddedData = this._padding(data);
    let childKey = this._childKey();
    let encryptedChildKey = this._encryptedChildKey(childKey)
    let encryptedData = Buffer.alloc(metaDataSize + paddedData.length)
    //Write padding size to encrypted
    encryptedData.writeUInt8(paddingSize, 0);
    //Write child key to encryptedData
    encryptedChildKey.copy(encryptedData, PADDING_SIZE)
    for (let i = 0, c = 0; i < paddedData.length; i += 4, c += 4) {
      //Generate new key
      if (c === STREAM_SIZE) {
        childKey = this._nextChildKey(childKey)
        c = 0
      }
      encryptedData.writeUInt32BE((paddedData.readUInt32BE(i) ^ childKey.readUInt32BE(c)) >>> 0, i + metaDataSize)
    }
    return encryptedData
  }

  decrypt(encryptedData: Buffer): Buffer {
    let metaDataSize = PADDING_SIZE + STREAM_SIZE;
    let encryptedChildKey = Buffer.alloc(STREAM_SIZE)
    //Get padding size
    let paddingSize = encryptedData.readUInt8(0)
    //Get encrypted key
    encryptedData.copy(encryptedChildKey, 0, PADDING_SIZE, STREAM_SIZE + 1)
    //Decipher key
    let childKey = this._encryptedChildKey(encryptedChildKey)
    let decryptedData = Buffer.allocUnsafe(encryptedData.length - metaDataSize)
    for (let i = 0, c = 0; i < decryptedData.length; i += 4, c += 4) {
      //Generate new key
      if (c === STREAM_SIZE) {
        childKey = this._nextChildKey(childKey)
        c = 0
      }
      decryptedData.writeUInt32BE((encryptedData.readUInt32BE(i+metaDataSize) ^ childKey.readUInt32BE(c)) >>> 0, i)
    }
    return decryptedData.slice(0, decryptedData.length - paddingSize)
  }

}
