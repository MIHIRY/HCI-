import { Request, Response } from 'express';
import { ContextDetectionService } from '../services/context-detection.service';
import { MLClientService } from '../services/ml-client.service';

const contextService = new ContextDetectionService();
const mlClient = new MLClientService();

/**
 * POST /api/v1/context/detect
 * Detect context from text input
 * Uses ML service if available, falls back to rule-based
 */
export const detectContext = async (req: Request, res: Response): Promise<void> => {
  try {
    const { text, user_id, session_id, previous_context, use_ml = true } = req.body;

    // Validation
    if (!text || typeof text !== 'string') {
      res.status(400).json({
        error: 'Invalid request',
        message: 'Text field is required and must be a string'
      });
      return;
    }

    if (text.length < 10) {
      res.status(400).json({
        error: 'Text too short',
        message: 'Please provide at least 10 characters for accurate detection'
      });
      return;
    }

    let result;
    let method = 'rule-based';

    // Try ML service first if requested and available
    if (use_ml && mlClient.isServiceAvailable()) {
      try {
        const mlResult = await mlClient.detectContext(text, previous_context, true);

        if (mlResult) {
          // Use ML result
          result = {
            context: mlResult.context,
            confidence: mlResult.confidence,
            detectionId: mlResult.detection_id,
            alternativeContexts: mlResult.alternative_contexts
          };
          method = mlResult.method;
        }
      } catch (mlError) {
        console.log('ML detection failed, falling back to rule-based');
      }
    }

    // Fallback to rule-based if ML not available or failed
    if (!result) {
      const ruleBasedResult = contextService.detect(text, previous_context);
      result = ruleBasedResult;
      method = 'rule-based';
    }

    // Store detection in database if session_id is provided
    if (session_id) {
      // TODO: Store in database using Prisma
      // await prisma.contextDetection.create({ ... });
    }

    res.status(200).json({
      context: result.context,
      confidence: result.confidence,
      timestamp: new Date().toISOString(),
      detection_id: result.detectionId,
      alternative_contexts: result.alternativeContexts,
      method: method // Indicate which method was used
    });

  } catch (error) {
    console.error('Error in detectContext:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to detect context'
    });
  }
};
