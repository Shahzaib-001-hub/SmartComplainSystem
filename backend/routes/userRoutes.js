import express from 'express';
import {
  getAllUsers,
  getUserById,
  approveUser,
  rejectUser,
  toggleUserStatus,
  updateUserRole,
  deleteUser,
} from '../controllers/userController.js';
import { protect, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, requireAdmin);

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id/approve', approveUser);
router.put('/:id/reject', rejectUser);
router.put('/:id/toggle-status', toggleUserStatus);
router.put('/:id/role', updateUserRole);
router.delete('/:id', deleteUser);

export default router;
