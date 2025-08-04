const crypto = require('crypto');

const SECRET_KEY = process.env.SECRET_KEY;
const IV = Buffer.from('1234567890123456'); // 16 bytes static IV (for demo only)

if (!SECRET_KEY || SECRET_KEY.length !== 32) {
  throw new Error('SECRET_KEY must be set in .env and be 32 bytes long');
}

function encryptData(data) {
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(SECRET_KEY), IV);
  let encrypted = cipher.update(data, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return encrypted;
}

function decryptData(encrypted) {
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(SECRET_KEY), IV);
  let decrypted = decipher.update(encrypted, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

module.exports = { encryptData, decryptData }; 