const { decryptData } = require('../utils/backendCrypto');

function decryptPayload(req, res, next) {
  if (req.body && req.body.payload) {
    try {
      const decrypted = decryptData(req.body.payload);
      req.decryptedBody = JSON.parse(decrypted);
      next();
    } catch (err) {
      return res.status(400).json({ error: 'Invalid encrypted payload' });
    }
  } else {
    next();
  }
}

module.exports = decryptPayload; 