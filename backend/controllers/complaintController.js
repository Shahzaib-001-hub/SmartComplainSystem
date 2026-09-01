import Complaint from '../models/Complaint.js';

// @desc    Create a new complaint
// @route   POST /api/complaints
// @access  Private (Active User)
export const createComplaint = async (req, res) => {
  try {
    const { title, description, category, priority, department, location, attachments } =
      req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a title and description for the complaint',
      });
    }

    const complaint = new Complaint({
      title,
      description,
      category: category || 'General',
      priority: priority || 'Medium',
      department: department || req.user.department || '',
      location: location || '',
      attachments: attachments || [],
      user: req.user._id,
      status: 'PENDING',
      timeline: [
        {
          status: 'PENDING',
          updatedBy: req.user._id,
          updatedByName: req.user.name,
          note: 'Complaint submitted by user',
          timestamp: new Date(),
        },
      ],
    });

    const savedComplaint = await complaint.save();
    await savedComplaint.populate('user', 'name email department studentId phone');

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully',
      complaint: savedComplaint,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged in user's complaints
// @route   GET /api/complaints/my
// @access  Private (Active User)
export const getMyComplaints = async (req, res) => {
  try {
    const { status, category, priority, search } = req.query;

    const query = { user: req.user._id };

    if (status && status !== 'all') {
      query.status = status;
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    if (priority && priority !== 'all') {
      query.priority = priority;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { ticketId: { $regex: search, $options: 'i' } },
      ];
    }

    const complaints = await Complaint.find(query)
      .populate('user', 'name email studentId department')
      .sort({ createdAt: -1 });

    const total = await Complaint.countDocuments({ user: req.user._id });
    const pending = await Complaint.countDocuments({ user: req.user._id, status: 'PENDING' });
    const inProgress = await Complaint.countDocuments({
      user: req.user._id,
      status: 'IN PROGRESS',
    });
    const resolved = await Complaint.countDocuments({
      user: req.user._id,
      status: 'RESOLVED',
    });
    const rejected = await Complaint.countDocuments({
      user: req.user._id,
      status: 'REJECTED',
    });

    res.json({
      success: true,
      count: complaints.length,
      stats: {
        total,
        pending,
        inProgress,
        resolved,
        rejected,
      },
      complaints,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all complaints (Admin View)
// @route   GET /api/complaints
// @access  Private/Admin
export const getAllComplaints = async (req, res) => {
  try {
    const { status, category, priority, search, department } = req.query;

    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    if (priority && priority !== 'all') {
      query.priority = priority;
    }

    if (department && department !== 'all') {
      query.department = department;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { ticketId: { $regex: search, $options: 'i' } },
      ];
    }

    const complaints = await Complaint.find(query)
      .populate('user', 'name email studentId department phone')
      .populate('assignedAdmin', 'name email')
      .sort({ createdAt: -1 });

    const total = await Complaint.countDocuments();
    const pending = await Complaint.countDocuments({ status: 'PENDING' });
    const inProgress = await Complaint.countDocuments({ status: 'IN PROGRESS' });
    const resolved = await Complaint.countDocuments({ status: 'RESOLVED' });
    const rejected = await Complaint.countDocuments({ status: 'REJECTED' });

    res.json({
      success: true,
      count: complaints.length,
      stats: {
        total,
        pending,
        inProgress,
        resolved,
        rejected,
      },
      complaints,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single complaint by ID
// @route   GET /api/complaints/:id
// @access  Private (Owner or Admin)
export const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('user', 'name email studentId department phone avatar')
      .populate('assignedAdmin', 'name email');

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    if (
      req.user.role !== 'admin' &&
      complaint.user._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You cannot view complaints filed by other users',
      });
    }

    res.json({
      success: true,
      complaint,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update complaint status & add remarks (Admin)
// @route   PUT /api/complaints/:id/status
// @access  Private/Admin
export const updateComplaintStatus = async (req, res) => {
  try {
    const { status, adminRemarks, assignedAdmin } = req.body;

    const validStatuses = ['PENDING', 'IN PROGRESS', 'RESOLVED', 'REJECTED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    const previousStatus = complaint.status;
    complaint.status = status;

    if (adminRemarks !== undefined) {
      complaint.adminRemarks = adminRemarks;
    }

    if (assignedAdmin) {
      complaint.assignedAdmin = assignedAdmin;
    }

    // Append to timeline audit trail
    complaint.timeline.push({
      status,
      updatedBy: req.user._id,
      updatedByName: req.user.name,
      note:
        adminRemarks ||
        `Status changed from ${previousStatus} to ${status} by Admin ${req.user.name}`,
      timestamp: new Date(),
    });

    const updatedComplaint = await complaint.save();
    await updatedComplaint.populate('user', 'name email studentId department phone');
    await updatedComplaint.populate('assignedAdmin', 'name email');

    res.json({
      success: true,
      message: `Complaint status updated to ${status}`,
      complaint: updatedComplaint,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a complaint
// @route   DELETE /api/complaints/:id
// @access  Private (Admin or Owner if pending)
export const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    // Owner can only delete if status is PENDING; Admin can delete any
    if (
      req.user.role !== 'admin' &&
      (complaint.user.toString() !== req.user._id.toString() || complaint.status !== 'PENDING')
    ) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own pending complaints',
      });
    }

    await Complaint.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Complaint deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
