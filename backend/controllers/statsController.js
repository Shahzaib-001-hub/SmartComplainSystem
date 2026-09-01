import Complaint from '../models/Complaint.js';
import User from '../models/User.js';

// @desc    Get Admin Dashboard Stats & Analytics
// @route   GET /api/stats/admin
// @access  Private/Admin
export const getAdminStats = async (req, res) => {
  try {
    const [
      totalComplaints,
      pendingComplaints,
      inProgressComplaints,
      resolvedComplaints,
      rejectedComplaints,
      totalUsers,
      pendingUsers,
      activeUsers,
      deactivatedUsers,
      recentComplaints,
      recentPendingUsers,
      categoryStats,
      priorityStats,
    ] = await Promise.all([
      Complaint.countDocuments(),
      Complaint.countDocuments({ status: 'PENDING' }),
      Complaint.countDocuments({ status: 'IN PROGRESS' }),
      Complaint.countDocuments({ status: 'RESOLVED' }),
      Complaint.countDocuments({ status: 'REJECTED' }),
      User.countDocuments({ role: 'user' }),
      User.countDocuments({ role: 'user', status: 'pending' }),
      User.countDocuments({ role: 'user', status: 'active' }),
      User.countDocuments({ role: 'user', status: 'deactivated' }),
      Complaint.find()
        .populate('user', 'name email department studentId')
        .sort({ createdAt: -1 })
        .limit(5),
      User.find({ status: 'pending' })
        .sort({ createdAt: -1 })
        .limit(5),
      Complaint.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Complaint.aggregate([
        { $group: { _id: '$priority', count: { $sum: 1 } } },
      ]),
    ]);

    res.json({
      success: true,
      stats: {
        complaints: {
          total: totalComplaints,
          pending: pendingComplaints,
          inProgress: inProgressComplaints,
          resolved: resolvedComplaints,
          rejected: rejectedComplaints,
        },
        users: {
          total: totalUsers,
          pending: pendingUsers,
          active: activeUsers,
          deactivated: deactivatedUsers,
        },
        categoryStats,
        priorityStats,
        recentComplaints,
        recentPendingUsers,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get User Dashboard Stats
// @route   GET /api/stats/user
// @access  Private (Active User)
export const getUserStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const [
      total,
      pending,
      inProgress,
      resolved,
      rejected,
      recentComplaints,
    ] = await Promise.all([
      Complaint.countDocuments({ user: userId }),
      Complaint.countDocuments({ user: userId, status: 'PENDING' }),
      Complaint.countDocuments({ user: userId, status: 'IN PROGRESS' }),
      Complaint.countDocuments({ user: userId, status: 'RESOLVED' }),
      Complaint.countDocuments({ user: userId, status: 'REJECTED' }),
      Complaint.find({ user: userId }).sort({ createdAt: -1 }).limit(5),
    ]);

    res.json({
      success: true,
      stats: {
        total,
        pending,
        inProgress,
        resolved,
        rejected,
        recentComplaints,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
