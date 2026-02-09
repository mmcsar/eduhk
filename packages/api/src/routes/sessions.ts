import { Router } from 'express';
import {
  getSessions,
  getSessionById,
  createSession,
  updateSession,
  completeSession,
  cancelSession,
  getSessionStats,
} from '../controllers/sessionController';

const router = Router();

router.get('/stats', getSessionStats);
router.get('/', getSessions);
router.get('/:id', getSessionById);
router.post('/', createSession);
router.put('/:id', updateSession);
router.patch('/:id/complete', completeSession);
router.patch('/:id/cancel', cancelSession);

export default router;
