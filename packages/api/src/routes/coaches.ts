import { Router } from 'express';
import {
  getCoaches,
  getCoachById,
  createCoach,
  updateCoach,
  deleteCoach,
} from '../controllers/coachController';

const router = Router();

router.get('/', getCoaches);
router.get('/:id', getCoachById);
router.post('/', createCoach);
router.put('/:id', updateCoach);
router.delete('/:id', deleteCoach);

export default router;
