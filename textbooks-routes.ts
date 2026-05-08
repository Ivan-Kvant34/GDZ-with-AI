import express from 'express';
import { verifyToken } from '../middleware/auth';
import {
  getTextbooks,
  getTextbookById,
  getSubjects,
  getTopics,
  getCountries,
  getGrades,
} from '../controllers/textbooks';

const router = express.Router();

router.get('/countries', getCountries);
router.get('/grades', getGrades);
router.get('/subjects', getSubjects);
router.get('/topics', getTopics);
router.get('/', getTextbooks);
router.get('/:id', getTextbookById);

export default router;
