import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

/**
 * POST /api/v1/study/participant
 * Register a new study participant
 */
export const createParticipant = async (req: Request, res: Response): Promise<void> => {
  try {
    const { demographics, consent_given } = req.body;

    if (!consent_given) {
      res.status(400).json({
        error: 'Consent required',
        message: 'Participant must give consent to participate in the study'
      });
      return;
    }

    // Randomly assign study group
    const studyGroups = ['adaptive', 'static'];
    const studyGroup = studyGroups[Math.floor(Math.random() * studyGroups.length)];

    // TODO: Create user in database
    const userId = uuidv4();

    res.status(201).json({
      user_id: userId,
      study_group: studyGroup,
      session_token: 'mock-jwt-token' // TODO: Generate actual JWT
    });

  } catch (error) {
    console.error('Error in createParticipant:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to create participant'
    });
  }
};

/**
 * POST /api/v1/study/session
 * Create a new study session
 */
export const createSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_id, keyboard_type } = req.body;

    if (!user_id || !keyboard_type) {
      res.status(400).json({
        error: 'Invalid request',
        message: 'user_id and keyboard_type are required'
      });
      return;
    }

    const sessionId = uuidv4();

    // TODO: Create session in database

    res.status(201).json({
      session_id: sessionId,
      user_id,
      keyboard_type,
      start_time: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in createSession:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to create session'
    });
  }
};

/**
 * GET /api/v1/study/tasks/:userId
 * Get assigned tasks for a participant
 */
export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    // Mock tasks - in production, fetch from database and randomize
    const tasks = [
      {
        task_id: uuidv4(),
        type: 'code',
        description: 'Write a function to calculate Fibonacci sequence',
        order: 1,
        estimated_duration: 300
      },
      {
        task_id: uuidv4(),
        type: 'email',
        description: 'Write a professional meeting request email',
        order: 2,
        estimated_duration: 240
      },
      {
        task_id: uuidv4(),
        type: 'chat',
        description: 'Tell your friend about getting concert tickets',
        order: 3,
        estimated_duration: 180
      }
    ];

    res.status(200).json({ tasks });

  } catch (error) {
    console.error('Error in getTasks:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve tasks'
    });
  }
};

/**
 * POST /api/v1/study/task/complete
 * Mark a task as completed
 */
export const completeTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { task_id, user_id, completion_time, satisfaction_rating, comments } = req.body;

    if (!task_id || !user_id) {
      res.status(400).json({
        error: 'Invalid request',
        message: 'task_id and user_id are required'
      });
      return;
    }

    // TODO: Update task completion in database

    res.status(200).json({
      success: true,
      completion_id: uuidv4(),
      completed_at: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in completeTask:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to complete task'
    });
  }
};

/**
 * POST /api/v1/study/questionnaire
 * Submit questionnaire responses
 */
export const submitQuestionnaire = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_id, session_id, questionnaire_type, responses } = req.body;

    if (!user_id || !questionnaire_type || !responses) {
      res.status(400).json({
        error: 'Invalid request',
        message: 'user_id, questionnaire_type, and responses are required'
      });
      return;
    }

    // TODO: Store questionnaire responses in database

    res.status(201).json({
      success: true,
      response_id: uuidv4(),
      submitted_at: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in submitQuestionnaire:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to submit questionnaire'
    });
  }
};
