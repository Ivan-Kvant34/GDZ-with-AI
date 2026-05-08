import express from 'express';
import { register, login, refresh } from '../controllers/auth';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);

export default router;
