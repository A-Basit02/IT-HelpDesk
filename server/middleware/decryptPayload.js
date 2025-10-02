const { decryptData } = require('../utils/backendCrypto');

function decryptPayload(req, res, next) {
  // Define public routes that don't need decryption
  const publicRoutes = [
    '/api/users/forgotPassword',
    '/api/users/verifyOTP', 
    '/api/users/resetPassword'
  ];
  
  // Check if this is a public route
  const isPublicRoute = publicRoutes.some(route => req.path === route);
  
  if (isPublicRoute) {
    // For public routes, skip decryption and go to next middleware
    return next();
  }
  
  // For protected routes, handle decryption
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