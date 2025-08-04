import CryptoJS from 'crypto-js';

const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;
const IV = CryptoJS.enc.Utf8.parse('1234567890123456'); // 16 bytes static IV (for demo only)

if (!SECRET_KEY || SECRET_KEY.length !== 32) {
  throw new Error('VITE_SECRET_KEY must be set in .env and be 32 bytes long');
}

export function encryptData(data) {
  const key = CryptoJS.enc.Utf8.parse(SECRET_KEY);
  const encrypted = CryptoJS.AES.encrypt(data, key, {
    iv: IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
}

export function decryptData(ciphertext) {
  const key = CryptoJS.enc.Utf8.parse(SECRET_KEY);
  const decrypted = CryptoJS.AES.decrypt(ciphertext, key, {
    iv: IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
} 