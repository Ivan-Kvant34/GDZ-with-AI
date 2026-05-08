import express from 'express';
import { verifyToken } from '../middleware/auth';
import { explainTopic, solveProblem, getHistory } from '../controllers/ai';

const router = express.Router();

router.post('/explain', verifyToken, explainTopic);
router.post('/solve', verifyToken, solveProblem);
router.get('/history', verifyToken, getHistory);

export default router;
