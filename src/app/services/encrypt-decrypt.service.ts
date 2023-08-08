import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptDecryptService {

  constructor() { }
  /**
   * encrypt value using cryptojs
   * @PASSPHRASE
   * @txtToDecrypt
   */
  encryptText(PASSPHRASE, txtToEncrypt) {

    var salt = CryptoJS.lib.WordArray.random(256 / 16);
    var iv = CryptoJS.lib.WordArray.random(256 / 16);
    var key128Bits = CryptoJS.PBKDF2(PASSPHRASE, salt, { keySize: 256 / 32 });
    var key128Bits100Iterations = CryptoJS.PBKDF2(PASSPHRASE, salt, { keySize: 256 / 32, iterations: 1000 });
    var encrypted = CryptoJS.AES.encrypt(txtToEncrypt, key128Bits100Iterations, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    var CombineData = salt + " " + iv + " " + encrypted;
    console.log('SERVICE REQUEST ', txtToEncrypt);
    console.log('PASSPHRASE: ', PASSPHRASE);
    return CombineData;
  }

 /**
   * decrypt value using cryptojs
   * @PASSPHRASE
   * @txtToDecrypt
   */
  decryptText(PASSPHRASE, txtToDecrypt) {
    try {
      var arrdata = txtToDecrypt.split(" ");
      var serverSalt = arrdata[0],
        serveriv = arrdata[1],
        encryptedData = arrdata[2];
      var salt = CryptoJS.enc.Hex.parse(serverSalt);
      var iv = CryptoJS.enc.Hex.parse(serveriv);
      var key = CryptoJS.PBKDF2(PASSPHRASE, salt, { keySize: 256 / 32, iterations: 1000 });
      var decrypt = CryptoJS.AES.decrypt(encryptedData, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });

      var decryptValue = decrypt.toString(CryptoJS.enc.Utf8);
      // console.log(PASSPHRASE);
      return decryptValue;

    }
    catch (e) {
      return e;
    }
  }


  /**
   * MD5 encryption for password
   * @txtToHash
   */
  createMD5Value(txtToHash){
    try{
      // return CryptoJS.MD5(txtToHash).toString();
       return CryptoJS.SHA256(txtToHash).toString();
    }
    catch(e){
      return e;
    }
  }

  //The set method is use for encrypt the value.
  //other method need to remove
  set(keys, value) {
    var key = CryptoJS.enc.Utf8.parse(keys);
    var iv = CryptoJS.enc.Utf8.parse(keys);
    var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value.toString()), key,
      {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });

    return encrypted.toString();
  }

  //The get method is use for decrypt the value.
  //other method need to remove
  get(keys, value) {
    var key = CryptoJS.enc.Utf8.parse(keys);
    var iv = CryptoJS.enc.Utf8.parse(keys);
    var decrypted = CryptoJS.AES.decrypt(value, key, {
      keySize: 128 / 8,
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  
  /**
 * MD5 encryption for password
 * @txtToHash
 */
   createSHA256Value(txtToHash: any){
    try{
      return CryptoJS.SHA256(txtToHash).toString();
    }
    catch(e){
      return e;
    }
  }
}
