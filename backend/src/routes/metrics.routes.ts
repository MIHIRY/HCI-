import { Router } from 'express';
import {
  logKeystroke,
  getSessionMetrics,
  getCurrentMetrics
} from '../controllers/metrics.controller';

const router = Router();

/**
 * POST /api/v1/metrics/keystroke
 * Log a single keystroke event
 */
router.post('/keystroke', logKeystroke);

/**
 * GET /api/v1/metrics/session/:sessionId
 * Get aggregated metrics for a session
 */
router.get('/session/:sessionId', getSessionMetrics);

/**
 * GET /api/v1/metrics/current/:sessionId
 * Get current real-time metrics
 */
router.get('/current/:sessionId', getCurrentMetrics);

export default router;
