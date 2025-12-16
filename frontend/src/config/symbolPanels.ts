/**
 * Context-Specific Symbol Panel Configurations
 * Different symbol sets for code, email, and chat contexts
 */

import type { ContextType } from '../types';

export interface SymbolButton {
  symbol: string;
  label?: string;
  size?: 'small' | 'medium' | 'large';
}

export interface SymbolRow {
  symbols: SymbolButton[];
}

export interface SymbolPanelConfig {
  title: string;
  color: string;
  rows: SymbolRow[];
}

/**
 * CODE Context - Programming symbols and operators
 */
const CODE_SYMBOLS: SymbolPanelConfig = {
  title: 'Code Symbols',
  color: '#3B82F6', // Blue
  rows: [
    {
      symbols: [
        { symbol: '()', label: '()' },
        { symbol: '{}', label: '{}' },
        { symbol: '[]', label: '[]' },
        { symbol: '<>', label: '<>' },
        { symbol: ';' },
        { symbol: ':' },
        { symbol: '=>', label: '=>' },
        { symbol: '!=', label: '!=' },
      ]
    },
    {
      symbols: [
        { symbol: '&&', label: '&&' },
        { symbol: '||', label: '||' },
        { symbol: '===', label: '===' },
        { symbol: '!==', label: '!==' },
        { symbol: '+=', label: '+=' },
        { symbol: '-=', label: '-=' },
        { symbol: '*=', label: '*=' },
        { symbol: '/=', label: '/=' },
      ]
    },
    {
      symbols: [
        { symbol: '//', label: '//' },
        { symbol: '/*', label: '/*' },
        { symbol: '*/', label: '*/' },
        { symbol: '#' },
        { symbol: '$' },
        { symbol: '@' },
        { symbol: '\\' },
        { symbol: '|' },
        { symbol: '^' },
        { symbol: '~' },
      ]
    },
    {
      symbols: [
        { symbol: '`' },
        { symbol: '"' },
        { symbol: "'" },
        { symbol: '_' },
        { symbol: '.' },
        { symbol: ',' },
        { symbol: '?' },
        { symbol: '!' },
      ]
    }
  ]
};

/**
 * EMAIL Context - Professional symbols and punctuation
 */
const EMAIL_SYMBOLS: SymbolPanelConfig = {
  title: 'Email Symbols',
  color: '#6B7280', // Gray
  rows: [
    {
      symbols: [
        { symbol: '@' },
        { symbol: '.com', label: '.com' },
        { symbol: '.org', label: '.org' },
        { symbol: '.edu', label: '.edu' },
        { symbol: '.net', label: '.net' },
        { symbol: '-' },
        { symbol: '_' },
        { symbol: '/' },
      ]
    },
    {
      symbols: [
        { symbol: '•', label: '•' },
        { symbol: '·', label: '·' },
        { symbol: '—', label: '—' },
        { symbol: '–', label: '–' },
        { symbol: '"', label: '"' },
        { symbol: '"', label: '"' },
        { symbol: "'", label: "'" },
        { symbol: "'", label: "'" },
      ]
    },
    {
      symbols: [
        { symbol: '©', label: '©' },
        { symbol: '®', label: '®' },
        { symbol: '™', label: '™' },
        { symbol: '€', label: '€' },
        { symbol: '£', label: '£' },
        { symbol: '¥', label: '¥' },
        { symbol: '$', label: '$' },
        { symbol: '¢', label: '¢' },
      ]
    },
    {
      symbols: [
        { symbol: '…', label: '…' },
        { symbol: ':', label: ':' },
        { symbol: ';', label: ';' },
        { symbol: '(', label: '(' },
        { symbol: ')', label: ')' },
        { symbol: '[', label: '[' },
        { symbol: ']', label: ']' },
        { symbol: '&', label: '&' },
      ]
    }
  ]
};

/**
 * CHAT Context - Emojis, emoticons, and casual symbols
 */
const CHAT_SYMBOLS: SymbolPanelConfig = {
  title: 'Chat Symbols',
  color: '#A855F7', // Purple
  rows: [
    {
      symbols: [
        { symbol: '😊', label: '😊', size: 'large' },
        { symbol: '😂', label: '😂', size: 'large' },
        { symbol: '❤️', label: '❤️', size: 'large' },
        { symbol: '👍', label: '👍', size: 'large' },
        { symbol: '🔥', label: '🔥', size: 'large' },
        { symbol: '✨', label: '✨', size: 'large' },
        { symbol: '🎉', label: '🎉', size: 'large' },
        { symbol: '💯', label: '💯', size: 'large' },
      ]
    },
    {
      symbols: [
        { symbol: '😭', label: '😭', size: 'large' },
        { symbol: '🤔', label: '🤔', size: 'large' },
        { symbol: '😅', label: '😅', size: 'large' },
        { symbol: '🙏', label: '🙏', size: 'large' },
        { symbol: '💀', label: '💀', size: 'large' },
        { symbol: '😍', label: '😍', size: 'large' },
        { symbol: '🥰', label: '🥰', size: 'large' },
        { symbol: '😎', label: '😎', size: 'large' },
      ]
    },
    {
      symbols: [
        { symbol: ':)', label: ':)' },
        { symbol: ':(', label: ':(' },
        { symbol: ':D', label: ':D' },
        { symbol: '<3', label: '<3' },
        { symbol: 'lol', label: 'lol' },
        { symbol: 'omg', label: 'omg' },
        { symbol: 'btw', label: 'btw' },
        { symbol: 'brb', label: 'brb' },
      ]
    },
    {
      symbols: [
        { symbol: '!', label: '!' },
        { symbol: '?', label: '?' },
        { symbol: '!!', label: '!!' },
        { symbol: '??', label: '??' },
        { symbol: '...', label: '...' },
        { symbol: '~', label: '~' },
        { symbol: '*', label: '*' },
        { symbol: '^_^', label: '^_^' },
      ]
    }
  ]
};

/**
 * Get symbol panel configuration for a given context
 */
export function getSymbolPanel(context: ContextType): SymbolPanelConfig {
  switch (context) {
    case 'code':
      return CODE_SYMBOLS;
    case 'email':
      return EMAIL_SYMBOLS;
    case 'chat':
      return CHAT_SYMBOLS;
    default:
      return CODE_SYMBOLS;
  }
}

/**
 * All symbol panels indexed by context
 */
export const SYMBOL_PANELS: Record<ContextType, SymbolPanelConfig> = {
  code: CODE_SYMBOLS,
  email: EMAIL_SYMBOLS,
  chat: CHAT_SYMBOLS
};
