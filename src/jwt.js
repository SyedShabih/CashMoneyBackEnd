const jwt = require('jsonwebtoken');

// Replace with your secret key (a strong, random string)
const SECRET_KEY = 'zaeem-qureshi-01100011';

/**
 * Creates a JWT token for a user ID.
 * @param {string} userId The user's Telegram ID.
 * @returns {string} The generated JWT token.
 */
export const createToken = (userId) => {
  const payload = {
    userId,
  };

  const options = {
    expiresIn: '10h', // Set expiration time (e.g., 1 hour)
  };

  return jwt.sign(payload, SECRET_KEY, options);
}