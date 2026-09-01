import express from 'express';
import {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  getComplaintById,
  updateComplaintStatus,
  deleteComplaint,
} from '../controllers/complaintController.js';
import { protect, requireActive, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// User routes (Active users)
router.post('/', protect, requireActive, createComplaint);
router.get('/my', protect, requireActive, getMyComplaints);

// Admin route (All complaints)
router.get('/', protect, requireAdmin, getAllComplaints);

// Single complaint routes
router.get('/:id', protect, requireActive, getComplaintById);
router.put('/:id/status', protect, requireAdmin, updateComplaintStatus);
router.delete('/:id', protect, requireActive, deleteComplaint);

export default router;
