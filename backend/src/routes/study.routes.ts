import { Router } from 'express';
import {
  createParticipant,
  getTasks,
  completeTask,
  submitQuestionnaire,
  createSession
} from '../controllers/study.controller';

const router = Router();

/**
 * POST /api/v1/study/participant
 * Register a new study participant
 */
router.post('/participant', createParticipant);

/**
 * POST /api/v1/study/session
 * Create a new study session
 */
router.post('/session', createSession);

/**
 * GET /api/v1/study/tasks/:userId
 * Get assigned tasks for a participant
 */
router.get('/tasks/:userId', getTasks);

/**
 * POST /api/v1/study/task/complete
 * Mark a task as completed
 */
router.post('/task/complete', completeTask);

/**
 * POST /api/v1/study/questionnaire
 * Submit questionnaire responses
 */
router.post('/questionnaire', submitQuestionnaire);

export default router;
