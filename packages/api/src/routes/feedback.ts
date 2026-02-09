import { Router } from 'express';
import {
  getFeedback,
  getFeedbackById,
  createFeedback,
  updateFeedback,
  deleteFeedback,
  getStudentFeedbackSummary,
} from '../controllers/feedbackController';

const router = Router();

router.get('/student/:studentId/summary', getStudentFeedbackSummary);
router.get('/', getFeedback);
router.get('/:id', getFeedbackById);
router.post('/', createFeedback);
router.put('/:id', updateFeedback);
router.delete('/:id', deleteFeedback);

export default router;
