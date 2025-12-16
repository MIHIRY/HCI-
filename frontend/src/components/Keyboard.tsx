import React from 'react';
import { useAppStore } from '../contexts/store';
import type { KeyConfig, SpecialButton } from '../types';

interface KeyboardProps {
  onKeyPress?: (key: string) => void;
}

const Keyboard: React.FC<KeyboardProps> = ({ onKeyPress }) => {
  const { currentLayout, currentContext } = useAppStore();

  if (!currentLayout) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
        <p className="text-gray-500">Loading keyboard...</p>
      </div>
    );
  }

  const handleKeyClick = (character: string) => {
    if (onKeyPress) {
      onKeyPress(character);
    }
  };

  const getKeyClassName = (key: KeyConfig) => {
    const baseClasses = 'keyboard-key transition-all duration-300';
    const contextClasses = {
      code: 'keyboard-key-code',
      email: 'keyboard-key-email',
      chat: 'keyboard-key-chat'
    };

    return `${baseClasses} ${contextClasses[currentContext]}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      {/* Keyboard Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">
          {currentLayout.mode.charAt(0).toUpperCase() + currentLayout.mode.slice(1)} Mode
        </h2>
        <div className={`context-badge context-badge-${currentContext}`}>
          {currentContext.toUpperCase()}
        </div>
      </div>

      {/* Keyboard Rows */}
      <div className="space-y-3">
        {currentLayout.layout.rows.map((row) => (
          <div key={row.row_id} className="flex gap-2 justify-start">
            {row.keys.map((key) => (
              <button
                key={key.key_id}
                className={getKeyClassName(key)}
                style={{
                  width: `${key.size.width}px`,
                  height: `${key.size.height}px`,
                  backgroundColor: key.color,
                  color: currentContext === 'chat' && key.character.match(/[\u{1F600}-\u{1F64F}]/u)
                    ? 'transparent'
                    : 'white'
                }}
                onClick={() => handleKeyClick(key.character)}
                title={`Press ${key.character}`}
              >
                <span className="text-sm md:text-base font-mono">
                  {key.character}
                </span>
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Special Buttons */}
      {currentLayout.special_buttons && currentLayout.special_buttons.length > 0 && (
        <div className="mt-6 flex gap-3 flex-wrap">
          {currentLayout.special_buttons.map((button: SpecialButton) => (
            <button
              key={button.button_id}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700
                         transition-colors text-sm font-medium"
              onClick={() => console.log(`Action: ${button.action}`)}
            >
              {button.label}
            </button>
          ))}
        </div>
      )}

      {/* Keyboard Info */}
      <div className="mt-4 text-xs text-gray-500 text-center">
        Layout: {currentLayout.mode} v{currentLayout.version} |
        Theme: {currentLayout.theme}
      </div>
    </div>
  );
};

export default Keyboard;
