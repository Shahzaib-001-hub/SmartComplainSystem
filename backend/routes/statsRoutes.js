import express from 'express';
import { getAdminStats, getUserStats } from '../controllers/statsController.js';
import { protect, requireActive, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/admin', protect, requireAdmin, getAdminStats);
router.get('/user', protect, requireActive, getUserStats);

export default router;
