import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new user (Student/Staff)
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, studentId, department, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email address already exists',
      });
    }

    // New registrations are always role: 'user' and status: 'pending'
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: 'user',
      status: 'pending',
      studentId: studentId || '',
      department: department || 'General',
      phone: phone || '',
    });

    res.status(201).json({
      success: true,
      message:
        'Registration submitted successfully! Your account is pending administrator approval before you can log in.',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration',
    });
  }
};

// @desc    Authenticate user & get token (Single Common Login Page)
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check Account Status according to workflow diagram
    if (user.status === 'pending') {
      return res.status(403).json({
        success: false,
        status: 'pending',
        message:
          'Access Denied: Your account is currently pending administrator approval. Please wait for an admin to activate your account.',
      });
    }

    if (user.status === 'rejected') {
      return res.status(403).json({
        success: false,
        status: 'rejected',
        message:
          'Access Denied: Your registration was rejected. Please contact the administrator for assistance.',
      });
    }

    if (user.status === 'deactivated') {
      return res.status(403).json({
        success: false,
        status: 'deactivated',
        message:
          'Access Denied: Your account has been deactivated by an administrator.',
      });
    }

    // Account is ACTIVE -> Generate token & return user info
    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        studentId: user.studentId,
        department: user.department,
        phone: user.phone,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during login',
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.name = req.body.name || user.name;
    user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
    user.department = req.body.department || user.department;
    user.studentId = req.body.studentId !== undefined ? req.body.studentId : user.studentId;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        status: updatedUser.status,
        studentId: updatedUser.studentId,
        department: updatedUser.department,
        phone: updatedUser.phone,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
