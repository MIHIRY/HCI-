import React from 'react';
import { useAppStore } from '../contexts/store';
import type { ContextType } from '../types';

interface ContextIndicatorProps {
  onManualOverride?: (context: ContextType) => void;
}

const ContextIndicator: React.FC<ContextIndicatorProps> = ({ onManualOverride }) => {
  const { currentContext, contextConfidence, previousContext } = useAppStore();

  const contextColors = {
    code: 'bg-blue-500',
    email: 'bg-gray-500',
    chat: 'bg-purple-500'
  };

  const contextIcons = {
    code: '{ }',
    email: '✉',
    chat: '💬'
  };

  const contextDescriptions = {
    code: 'Programming & Development',
    email: 'Professional Communication',
    chat: 'Casual Messaging'
  };

  const handleContextChange = (newContext: ContextType) => {
    if (onManualOverride) {
      onManualOverride(newContext);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      {/* Current Context Display */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 ${contextColors[currentContext]} rounded-full
                         flex items-center justify-center text-white text-xl font-bold`}>
            {contextIcons[currentContext]}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">
              {currentContext.charAt(0).toUpperCase() + currentContext.slice(1)} Mode
            </h3>
            <p className="text-sm text-gray-600">
              {contextDescriptions[currentContext]}
            </p>
          </div>
        </div>

        {/* Confidence Indicator */}
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-800">
            {Math.round(contextConfidence * 100)}%
          </div>
          <div className="text-xs text-gray-500">Confidence</div>
        </div>
      </div>

      {/* Confidence Bar */}
      <div className="mb-4">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${contextColors[currentContext]} transition-all duration-500`}
            style={{ width: `${contextConfidence * 100}%` }}
          />
        </div>
      </div>

      {/* Context Switch Info */}
      {previousContext && previousContext !== currentContext && (
        <div className="mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
          <span className="text-yellow-800">
            Switched from <strong>{previousContext}</strong> to <strong>{currentContext}</strong>
          </span>
        </div>
      )}

      {/* Manual Override Options */}
      <div>
        <div className="text-xs text-gray-500 mb-2 font-semibold">Manual Override:</div>
        <div className="flex gap-2">
          {(['code', 'email', 'chat'] as ContextType[]).map((context) => (
            <button
              key={context}
              onClick={() => handleContextChange(context)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium
                         transition-all border-2
                         ${currentContext === context
                           ? `${contextColors[context]} text-white border-transparent`
                           : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                         }`}
              title={`Switch to ${context} mode`}
            >
              <span className="block">{contextIcons[context]}</span>
              <span className="block text-xs mt-1">
                {context.charAt(0).toUpperCase() + context.slice(1)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Tooltip */}
      <div className="mt-3 text-xs text-gray-400 text-center">
        The keyboard automatically adapts to your writing context
      </div>
    </div>
  );
};

export default ContextIndicator;
