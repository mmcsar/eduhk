import { Router } from 'express';
import {
  getGoals,
  getGoalById,
  createGoal,
  updateGoal,
  updateGoalProgress,
  toggleMilestone,
  deleteGoal,
} from '../controllers/goalController';

const router = Router();

router.get('/', getGoals);
router.get('/:id', getGoalById);
router.post('/', createGoal);
router.put('/:id', updateGoal);
router.patch('/:id/progress', updateGoalProgress);
router.patch('/:id/milestones/:milestoneIndex/toggle', toggleMilestone);
router.delete('/:id', deleteGoal);

export default router;
