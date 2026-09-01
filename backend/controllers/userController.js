import User from '../models/User.js';

// @desc    Get all users with filtering, search, and pagination
// @route   GET /api/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const { status, role, search } = req.query;

    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (role && role !== 'all') {
      if (role === 'admin') {
        query.role = { $in: ['admin', 'super_admin'] };
      } else {
        query.role = role;
      }
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query)
      .populate('createdBy', 'name email role')
      .sort({ createdAt: -1 });

    const stats = {
      total: await User.countDocuments(),
      pending: await User.countDocuments({ status: 'pending' }),
      active: await User.countDocuments({ status: 'active' }),
      rejected: await User.countDocuments({ status: 'rejected' }),
      deactivated: await User.countDocuments({ status: 'deactivated' }),
      admins: await User.countDocuments({ role: { $in: ['admin', 'super_admin'] } }),
      superAdmins: await User.countDocuments({ role: 'super_admin' }),
      users: await User.countDocuments({ role: 'user' }),
    };

    res.json({
      success: true,
      count: users.length,
      stats,
      users,
      currentUserRole: req.user.role,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('createdBy', 'name email role');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve a pending user
// @route   PUT /api/users/:id/approve
// @access  Private/Admin
export const approveUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.status = 'active';
    await user.save();

    res.json({
      success: true,
      message: `User ${user.name} has been approved and activated`,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reject a pending user
// @route   PUT /api/users/:id/reject
// @access  Private/Admin
export const rejectUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.status = 'rejected';
    await user.save();

    res.json({
      success: true,
      message: `User ${user.name} has been rejected`,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Activate or Deactivate a user
// @route   PUT /api/users/:id/toggle-status
// @access  Private/Admin
export const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Protect super admin from deactivation
    if (user.role === 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'The Super Admin account cannot be deactivated.',
      });
    }

    // Prevent regular admin from deactivating other Admins
    if (user.role === 'admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Only the Super Admin has permission to deactivate other Admin accounts.',
      });
    }

    // Protect self deactivation
    if (req.user._id.toString() === user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot deactivate your own account',
      });
    }

    const newStatus = user.status === 'active' ? 'deactivated' : 'active';
    user.status = newStatus;
    await user.save();

    res.json({
      success: true,
      message: `User status changed to ${newStatus}`,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Change user role (user <-> admin, auto Super Admin creation)
// @route   PUT /api/users/:id/role
// @access  Private/Admin
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!['user', 'admin', 'super_admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role specified. Must be user, admin, or super_admin.',
      });
    }

    const targetUser = await User.findById(req.params.id);

    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Rule: Super Admin cannot be demoted or modified by ANY other Admin
    if (targetUser.role === 'super_admin' && role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'The Super Admin account cannot be deleted or demoted.',
      });
    }

    // Rule: Only Super Admin can demote other Admins back to User
    if (targetUser.role === 'admin' && role === 'user') {
      if (req.user.role !== 'super_admin') {
        return res.status(403).json({
          success: false,
          message: 'Access Denied: Only the Super Admin has permission to demote or manage Admin accounts.',
        });
      }
    }

    // Rule: When an Admin promotes someone to Admin, the creator automatically becomes the Super Admin
    let creatorElevated = false;
    if (role === 'admin' && targetUser.role === 'user') {
      if (req.user.role !== 'super_admin') {
        const creatorUser = await User.findById(req.user._id);
        if (creatorUser) {
          creatorUser.role = 'super_admin';
          await creatorUser.save();
          req.user.role = 'super_admin';
          creatorElevated = true;
        }
      }
      targetUser.createdBy = req.user._id;
    }

    targetUser.role = role;
    await targetUser.save();

    res.json({
      success: true,
      message: creatorElevated
        ? `User ${targetUser.name} has been promoted to Admin. You have automatically been elevated to Super Admin!`
        : `User role updated to ${role}`,
      user: targetUser,
      currentUser: {
        _id: req.user._id,
        role: req.user.role,
      },
      creatorElevated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);

    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Rule: Super Admin cannot be deleted by anyone
    if (targetUser.role === 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'The Super Admin account cannot be deleted.',
      });
    }

    // Rule: Only Super Admin can delete other Admins
    if (targetUser.role === 'admin') {
      if (req.user.role !== 'super_admin') {
        return res.status(403).json({
          success: false,
          message: 'Access Denied: Only the Super Admin has permission to delete Admin accounts.',
        });
      }
    }

    // Prevent self deletion
    if (req.user._id.toString() === targetUser._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account',
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: `Account for ${targetUser.name} (${targetUser.role}) has been deleted successfully`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
