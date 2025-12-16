import { Request, Response } from 'express';

// Mock layouts - in production these would come from database
const layouts = {
  code: {
    mode: 'code',
    version: '1.0',
    theme: 'code_blue',
    layout: {
      rows: [
        {
          row_id: 1,
          keys: [
            { key_id: 'left_brace', character: '{', position: { x: 100, y: 50 }, size: { width: 60, height: 60 }, frequency_rank: 1, color: '#3b82f6' },
            { key_id: 'right_brace', character: '}', position: { x: 170, y: 50 }, size: { width: 60, height: 60 }, frequency_rank: 2, color: '#3b82f6' },
            { key_id: 'left_paren', character: '(', position: { x: 240, y: 50 }, size: { width: 60, height: 60 }, frequency_rank: 3, color: '#3b82f6' },
            { key_id: 'right_paren', character: ')', position: { x: 310, y: 50 }, size: { width: 60, height: 60 }, frequency_rank: 4, color: '#3b82f6' },
            { key_id: 'semicolon', character: ';', position: { x: 380, y: 50 }, size: { width: 60, height: 60 }, frequency_rank: 5, color: '#3b82f6' }
          ]
        },
        {
          row_id: 2,
          keys: [
            { key_id: 'equals', character: '=', position: { x: 100, y: 120 }, size: { width: 60, height: 60 }, frequency_rank: 6, color: '#3b82f6' },
            { key_id: 'plus', character: '+', position: { x: 170, y: 120 }, size: { width: 50, height: 50 }, frequency_rank: 10, color: '#60a5fa' },
            { key_id: 'minus', character: '-', position: { x: 230, y: 120 }, size: { width: 50, height: 50 }, frequency_rank: 11, color: '#60a5fa' },
            { key_id: 'arrow', character: '=>', position: { x: 290, y: 120 }, size: { width: 60, height: 60 }, frequency_rank: 7, color: '#3b82f6' }
          ]
        }
      ]
    },
    special_buttons: [
      { button_id: 'autocomplete', label: 'Autocomplete', action: 'show_autocomplete', position: { x: 500, y: 50 } }
    ]
  },
  email: {
    mode: 'email',
    version: '1.0',
    theme: 'professional_gray',
    layout: {
      rows: [
        {
          row_id: 1,
          keys: [
            { key_id: 'period', character: '.', position: { x: 100, y: 50 }, size: { width: 60, height: 60 }, frequency_rank: 1, color: '#6b7280' },
            { key_id: 'comma', character: ',', position: { x: 170, y: 50 }, size: { width: 60, height: 60 }, frequency_rank: 2, color: '#6b7280' },
            { key_id: 'exclamation', character: '!', position: { x: 240, y: 50 }, size: { width: 50, height: 50 }, frequency_rank: 8, color: '#9ca3af' },
            { key_id: 'question', character: '?', position: { x: 300, y: 50 }, size: { width: 50, height: 50 }, frequency_rank: 9, color: '#9ca3af' }
          ]
        },
        {
          row_id: 2,
          keys: [
            { key_id: 'the', character: 'the', position: { x: 100, y: 120 }, size: { width: 70, height: 50 }, frequency_rank: 3, color: '#6b7280' },
            { key_id: 'and', character: 'and', position: { x: 180, y: 120 }, size: { width: 70, height: 50 }, frequency_rank: 4, color: '#6b7280' }
          ]
        }
      ]
    },
    special_buttons: [
      { button_id: 'templates', label: 'Templates', action: 'show_templates', position: { x: 500, y: 50 } },
      { button_id: 'signature', label: 'Signature', action: 'insert_signature', position: { x: 500, y: 120 } }
    ]
  },
  chat: {
    mode: 'chat',
    version: '1.0',
    theme: 'vibrant',
    layout: {
      rows: [
        {
          row_id: 1,
          keys: [
            { key_id: 'emoji_smile', character: '😊', position: { x: 100, y: 50 }, size: { width: 60, height: 60 }, frequency_rank: 1, color: '#8b5cf6' },
            { key_id: 'emoji_laugh', character: '😂', position: { x: 170, y: 50 }, size: { width: 60, height: 60 }, frequency_rank: 2, color: '#8b5cf6' },
            { key_id: 'emoji_heart', character: '❤️', position: { x: 240, y: 50 }, size: { width: 60, height: 60 }, frequency_rank: 3, color: '#8b5cf6' },
            { key_id: 'emoji_thumbs', character: '👍', position: { x: 310, y: 50 }, size: { width: 60, height: 60 }, frequency_rank: 4, color: '#8b5cf6' }
          ]
        },
        {
          row_id: 2,
          keys: [
            { key_id: 'lol', character: 'lol', position: { x: 100, y: 120 }, size: { width: 60, height: 50 }, frequency_rank: 5, color: '#a78bfa' },
            { key_id: 'omg', character: 'omg', position: { x: 170, y: 120 }, size: { width: 60, height: 50 }, frequency_rank: 6, color: '#a78bfa' },
            { key_id: 'btw', character: 'btw', position: { x: 240, y: 120 }, size: { width: 60, height: 50 }, frequency_rank: 7, color: '#a78bfa' }
          ]
        }
      ]
    },
    special_buttons: [
      { button_id: 'emoji_picker', label: 'More Emoji', action: 'show_emoji_picker', position: { x: 500, y: 50 } }
    ]
  }
};

/**
 * GET /api/v1/layout/:context
 * Get keyboard layout for specific context
 */
export const getLayoutByContext = async (req: Request, res: Response): Promise<void> => {
  try {
    const { context } = req.params;

    if (!['code', 'email', 'chat'].includes(context)) {
      res.status(400).json({
        error: 'Invalid context',
        message: 'Context must be one of: code, email, chat'
      });
      return;
    }

    const layout = layouts[context as keyof typeof layouts];

    res.status(200).json({
      ...layout,
      cache_duration: 3600 // Cache for 1 hour
    });

  } catch (error) {
    console.error('Error in getLayoutByContext:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve layout'
    });
  }
};

/**
 * GET /api/v1/layout
 * Get all available layouts
 */
export const getAllLayouts = async (req: Request, res: Response): Promise<void> => {
  try {
    res.status(200).json({
      layouts: Object.values(layouts),
      total: Object.keys(layouts).length
    });
  } catch (error) {
    console.error('Error in getAllLayouts:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve layouts'
    });
  }
};
