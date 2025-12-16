import { Router } from 'express';
import { detectContext } from '../controllers/context.controller';

const router = Router();

/**
 * POST /api/v1/context/detect
 * Detect context from provided text
 */
router.post('/detect', detectContext);

export default router;
