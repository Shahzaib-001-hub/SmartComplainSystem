import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'smart_complaint_super_secret_jwt_key_2026_!#'
      );

      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User no longer exists. Authorization denied.',
        });
      }

      next();
    } catch (error) {
      console.error('Token verification failed:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired authentication token',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided',
    });
  }
};

// Check if user account is Active
export const requireActive = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }

  if (req.user.status === 'pending') {
    return res.status(403).json({
      success: false,
      status: 'pending',
      message: 'Your account is pending administrator approval. Please wait for an admin to activate your account.',
    });
  }

  if (req.user.status === 'rejected') {
    return res.status(403).json({
      success: false,
      status: 'rejected',
      message: 'Your registration request was rejected by an administrator. Please contact support.',
    });
  }

  if (req.user.status === 'deactivated') {
    return res.status(403).json({
      success: false,
      status: 'deactivated',
      message: 'Your account has been deactivated. Please contact an administrator.',
    });
  }

  next();
};

// Check if user is an Administrator
export const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied: Administrator privileges required',
    });
  }
};
