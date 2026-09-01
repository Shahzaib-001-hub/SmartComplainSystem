import jwt from 'jsonwebtoken';

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'smart_complaint_super_secret_jwt_key_2026_!#', {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

export default generateToken;
