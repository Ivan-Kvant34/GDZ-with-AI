import express from 'express';
import { verifyToken } from '../middleware/auth';
import {
  getProfile,
  updateProfile,
  getUserHistory,
  getSavedItems,
  saveItem,
  unsaveItem,
} from '../controllers/user';

const router = express.Router();

router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, updateProfile);
router.get('/history', verifyToken, getUserHistory);
router.get('/saved-items', verifyToken, getSavedItems);
router.post('/saved-items', verifyToken, saveItem);
router.delete('/saved-items/:id', verifyToken, unsaveItem);

export default router;
