import jwt from 'jsonwebtoken';

const generateToken = (userId) => {
  const payload = { id: userId };
  const secret = 'your_jwt_secret_key';
  const options = { expiresIn: '1h' }; // Token expiration time

  return jwt.sign(payload, secret, options);
};

export default generateToken;
