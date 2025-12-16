/**
 * SuggestionStrip Component
 * Phase 3: Displays context-aware suggestions above the keyboard
 */

import React, { useRef } from 'react';
import { useSwipeGesture } from '../hooks/useSwipeGesture';
import type { ContextType } from '../types';

export interface Suggestion {
  text: string;
  confidence: number;
  type: 'keyword' | 'identifier' | 'phrase' | 'word' | 'emoji' | 'expression' | 'punctuation';
}

interface SuggestionStripProps {
  suggestions: Suggestion[];
  onSelect: (suggestion: Suggestion) => void;
  isLoading?: boolean;
  currentContext: ContextType;
}

const SuggestionStrip: React.FC<SuggestionStripProps> = ({
  suggestions,
  onSelect,
  isLoading = false,
  currentContext,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Context-specific colors
  const getContextColor = () => {
    switch (currentContext) {
      case 'code':
        return {
          bg: 'bg-blue-500',
          bgHover: 'hover:bg-blue-600',
          text: 'text-white',
          border: 'border-blue-600'
        };
      case 'email':
        return {
          bg: 'bg-gray-500',
          bgHover: 'hover:bg-gray-600',
          text: 'text-white',
          border: 'border-gray-600'
        };
      case 'chat':
        return {
          bg: 'bg-purple-500',
          bgHover: 'hover:bg-purple-600',
          text: 'text-white',
          border: 'border-purple-600'
        };
      default:
        return {
          bg: 'bg-gray-500',
          bgHover: 'hover:bg-gray-600',
          text: 'text-white',
          border: 'border-gray-600'
        };
    }
  };

  const colors = getContextColor();

  // SuggestionChip component with swipe-to-accept
  const SuggestionChip: React.FC<{ suggestion: Suggestion }> = ({ suggestion }) => {
    const [isLifted, setIsLifted] = React.useState(false);

    const swipe = useSwipeGesture({
      threshold: 20,
      onSwipeUp: () => {
        onSelect(suggestion);
      },
    });

    const handleSwipeStart = () => {
      setIsLifted(true);
    };

    const handleSwipeEnd = () => {
      setIsLifted(false);
    };

    return (
      <button
        className={`
          relative flex-shrink-0 px-3 py-1.5 rounded-full font-medium text-sm
          ${colors.bg} ${colors.bgHover} ${colors.text}
          transition-all active:scale-95 shadow-sm
          ${isLifted ? 'transform -translate-y-1 shadow-lg' : ''}
          ${swipe.isSwiping && swipe.swipeDirection === 'up' ? 'ring-2 ring-white' : ''}
        `}
        onClick={() => onSelect(suggestion)}
        onMouseDown={() => handleSwipeStart()}
        onMouseUp={() => handleSwipeEnd()}
        onTouchStart={() => handleSwipeStart()}
        onTouchEnd={() => handleSwipeEnd()}
        {...swipe.handlers}
      >
        {suggestion.text}
        {/* Confidence indicator */}
        {suggestion.confidence >= 0.8 && (
          <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-green-400 rounded-full"></span>
        )}
      </button>
    );
  };

  // Always render container with fixed height to prevent keyboard shift
  // Fixed height: header (28px) + content (48px) + borders (2px) = 78px minimum
  return (
    <div className="w-full bg-white border-t border-b border-gray-200 shadow-sm" style={{ minHeight: '88px' }}>
      {/* Header - always visible */}
      <div className="flex items-center justify-between px-3 py-1 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-600">=� Suggestions</span>
          {!isLoading && suggestions.length > 0 && (
            <span className="text-xs text-gray-400">Tap to insert " Swipe up for quick insert</span>
          )}
        </div>
        <span className={`text-xs font-medium ${
          currentContext === 'code' ? 'text-blue-600' :
          currentContext === 'email' ? 'text-gray-600' :
          'text-purple-600'
        }`}>
          {currentContext.toUpperCase()}
        </span>
      </div>

      {/* Content area - fixed height to prevent layout shift */}
      <div className="px-3 py-2" style={{ minHeight: '56px', display: 'flex', alignItems: 'center' }}>
        {isLoading ? (
          // Loading state
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-500"></div>
            <span>Loading suggestions...</span>
          </div>
        ) : suggestions.length === 0 ? (
          // Empty state - reserve space to prevent shift
          <div className="text-xs text-gray-400 italic">
            Start typing to see suggestions
          </div>
        ) : (
          // Suggestion chips - Horizontal scrollable
          <div
            ref={scrollContainerRef}
            className="flex gap-2 w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
            style={{
              scrollBehavior: 'smooth',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {suggestions.map((suggestion, index) => (
              <SuggestionChip key={`${suggestion.text}-${index}`} suggestion={suggestion} />
            ))}

            {/* Scroll indicator (if more items) */}
            {suggestions.length > 3 && (
              <div className="flex-shrink-0 flex items-center text-gray-400 text-sm px-2">
                �
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SuggestionStrip;
