import { Router } from 'express';
import { getLayoutByContext, getAllLayouts } from '../controllers/layout.controller';

const router = Router();

/**
 * GET /api/v1/layout/:context
 * Get keyboard layout for specific context (code/email/chat)
 */
router.get('/:context', getLayoutByContext);

/**
 * GET /api/v1/layout
 * Get all available layouts
 */
router.get('/', getAllLayouts);

export default router;
