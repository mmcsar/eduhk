import { Router } from 'express';
import coachRoutes from './coaches';
import sessionRoutes from './sessions';
import goalRoutes from './goals';
import feedbackRoutes from './feedback';

const router = Router();

router.use('/coaches', coachRoutes);
router.use('/sessions', sessionRoutes);
router.use('/goals', goalRoutes);
router.use('/feedback', feedbackRoutes);

export default router;
